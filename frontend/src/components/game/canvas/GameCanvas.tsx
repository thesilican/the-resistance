import React, { Fragment, useEffect, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import styles from "../../../styles/game/GameCanvas.module.scss";
import Texture from "./Texture";

const getDim = () => {
  return [window.innerWidth, window.innerHeight];
};

export default function GameCanvas() {
  const [dim, setDim] = useState(getDim);
  useEffect(() => {
    const handler = () => {
      setDim(getDim());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <Stage width={dim[0]} height={dim[1]} className={styles.canvasWrapper}>
      <Layer>
        <PlayerSprite flipped x={dim[0] / 2 + 200} y={dim[1] / 2} />
        <PlayerSprite flipped x={dim[0] / 2} y={dim[1] / 2 + 100} />
        <PlayerSprite x={dim[0] / 2} y={dim[1] / 2 - 100} />
        <PlayerSprite x={dim[0] / 2 - 200} y={dim[1] / 2} />
      </Layer>
    </Stage>
  );
}

type PlayerSpriteProps = {
  x: number;
  y: number;
  flipped?: boolean;
};

function PlayerSprite(props: PlayerSpriteProps) {
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState(false);
  const width = 100;
  const height = 150;

  return (
    <Fragment>
      <Texture
        type={"select"}
        x={props.x - width / 2}
        y={props.y - width / 2}
        flipped={props.flipped}
        width={width}
        height={height}
        opacity={selected ? 0.9 : hover ? 0.5 : 0.1}
      />
      <Texture
        type={"stickman"}
        x={props.x - width / 2}
        y={props.y - width / 2}
        flipped={props.flipped}
        width={width}
        height={height}
      />
      <Texture
        type={"hat"}
        x={props.x - width / 2}
        y={props.y - width / 2}
        flipped={props.flipped}
        width={width}
        height={height}
      />
      {/* Hitbox */}
      <Rect
        x={props.x - width / 2}
        y={props.y - width / 2}
        width={width}
        height={height}
        // stroke="white"
        onMouseOut={() => setHover(false)}
        onMouseOver={() => setHover(true)}
        onMouseDown={() => setSelected((x) => !x)}
      />
    </Fragment>
  );
}
