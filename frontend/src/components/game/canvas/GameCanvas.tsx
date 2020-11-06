import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Provider, useSelector } from "react-redux";
import "../../../lib/util";
import { equalSpaceEllipse, Vec2 } from "../../../lib/util";
import { GameSelector, store } from "../../../store";
import styles from "../../../styles/game/GameCanvas.module.scss";
import { PlayerSprite } from "./PlayerSprite";

export type StageInfo = {
  spritePos: Vec2[];
  spriteDim: Vec2;
  stagePos: Vec2;
  stageDim: Vec2;
};

function getStageDim(numPlayers: number, dim: Vec2): StageInfo {
  // +20 to account for text height
  const origSpriteDim = [100, 170] as Vec2;
  const stageDim: Vec2 = [dim[0] / 2, dim[1] * (6 / 8)];
  const stagePos: Vec2 = [
    (dim[0] - stageDim[0]) / 2,
    (dim[1] - stageDim[1]) / 2,
  ];
  const res = equalSpaceEllipse(numPlayers, stageDim, origSpriteDim);
  return {
    spritePos: res.spritePoints,
    spriteDim: res.spriteDim,
    stageDim,
    stagePos,
  };
}

type GameCanvasProps = {
  dim: Vec2;
};

export default function GameCanvas({ dim }: GameCanvasProps) {
  const numPlayers = useSelector(GameSelector.socketIDs).length;

  const stageInfo = useMemo(() => getStageDim(numPlayers, dim), [
    numPlayers,
    dim,
  ]);

  return (
    <Stage
      width={dim[0]}
      height={dim[1]}
      className={styles.canvasWrapper}
      style={{ height: dim[1] }}
    >
      <Layer>
        {/* Required for some reason */}
        <Provider store={store}>
          {Array.from(Array(numPlayers)).map((_, i) => (
            <PlayerSprite key={i} index={i} stageInfo={stageInfo} />
          ))}
        </Provider>
      </Layer>
    </Stage>
  );
}
