import { Rect, Text } from "react-konva";
import React, { Fragment, useState } from "react";
import Texture from "./Texture";
import { ColorOrder } from "common-modules";
import { ColorValues } from "../../../lib/util";

export type PlayerSpriteProps = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  flipped?: boolean;
};

export function PlayerSprite(props: PlayerSpriteProps) {
  const { width, height, flipped, index } = props;
  const x = props.x - width / 2;
  const y = props.y - height / 2;
  const spriteHeight = height * (15 / 17);
  const textHeight = height * (2 / 17);
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState(() => index % 3 === 0);

  const hat = index === 1;
  const color = ColorOrder[index] ?? ColorOrder[0];
  const colorCode = ColorValues[color];
  const opacity = selected ? 1 : 0.25;

  return (
    <Fragment>
      <Texture
        type={"select"}
        x={x}
        y={y}
        width={width}
        height={spriteHeight}
        flipped={flipped}
        opacity={selected ? 0.9 : hover ? 0.5 : 0.1}
      />
      <Texture
        type={"stickman"}
        color={color}
        x={x}
        y={y}
        width={width}
        height={spriteHeight}
        flipped={flipped}
        opacity={opacity}
      />
      {hat && (
        <Texture
          type={"hat"}
          x={x}
          y={y}
          width={width}
          height={spriteHeight}
          flipped={flipped}
          opacity={opacity}
        />
      )}
      <Text
        x={x}
        y={y + spriteHeight}
        width={width}
        height={textHeight}
        fontSize={textHeight}
        fill={colorCode}
        align={"center"}
        text={"Bobby"}
        opacity={opacity}
      />
      {/* Hitbox */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        // stroke="white"
        onMouseOut={() => setHover(false)}
        onMouseOver={() => setHover(true)}
        onMouseDown={() => setSelected((x) => !x)}
      />
      {/* <Rect x={props.x - 2} y={props.y - 2} width={4} height={4} fill="red" /> */}
    </Fragment>
  );
}
