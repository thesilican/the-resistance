import React, { useEffect, useMemo, useState } from "react";
import { Layer, Stage } from "react-konva";
import "../../../lib/util";
import { equalSpaceEllipse, Vec2 } from "../../../lib/util";
import styles from "../../../styles/game/GameCanvas.module.scss";
import { PlayerSprite } from "./PlayerSprite";

export type StageInfo = {
  spritePos: Vec2[];
  spriteDim: Vec2;
  stagePos: Vec2;
  stageDim: Vec2;
};

function getWindowDim() {
  return [window.innerWidth, window.innerHeight] as Vec2;
}

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

export default function GameCanvas() {
  const [dim, setDim] = useState(getWindowDim);
  const [numPlayers] = useState(6);

  useEffect(() => {
    // Handle window resize
    const handler = () => {
      setDim(getWindowDim());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const stageInfo = useMemo(() => getStageDim(numPlayers, dim), [
    numPlayers,
    dim,
  ]);

  return (
    <Stage width={dim[0]} height={dim[1]} className={styles.canvasWrapper}>
      <Layer>
        {Array.from(Array(numPlayers)).map((_, i) => (
          <PlayerSprite key={i} index={i} stageInfo={stageInfo} />
        ))}
      </Layer>
    </Stage>
  );
}
