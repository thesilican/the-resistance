import React, { useEffect, useMemo, useState } from "react";
import { Layer, Stage } from "react-konva";
import "../../../lib/util";
import { equalSpaceEllipse, Vec2 } from "../../../lib/util";
import styles from "../../../styles/game/GameCanvas.module.scss";
import { PlayerSprite } from "./PlayerSprite";

const getDim = () => {
  return [window.innerWidth, window.innerHeight] as Vec2;
};

const getStageDim = (numPlayers: number, dim: Vec2) => {
  const origSpriteDim = [100, 170] as Vec2;
  const stageDim: Vec2 = [dim[0] / 2, dim[1] / 1.5];
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
};

export default function GameCanvas() {
  const [dim, setDim] = useState(getDim);
  const [numPlayers] = useState(5);

  useEffect(() => {
    // Handle window resize
    const handler = () => {
      setDim(getDim());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // 170 height to adjust for text height
  const { spritePos, spriteDim, stagePos } = useMemo(
    () => getStageDim(numPlayers, dim),
    [numPlayers, dim]
  );

  return (
    <Stage width={dim[0]} height={dim[1]} className={styles.canvasWrapper}>
      <Layer>
        {spritePos.map((p, i) => (
          <PlayerSprite
            key={i}
            index={i}
            x={p[0] + stagePos[0]}
            y={p[1] + stagePos[1]}
            width={spriteDim[0]}
            height={spriteDim[1] * (15 / 17)}
            textHeight={spriteDim[1] * (2 / 17)}
            flipped={p[0] + stagePos[0] > dim[0] / 2}
          />
        ))}
      </Layer>
    </Stage>
  );
}
