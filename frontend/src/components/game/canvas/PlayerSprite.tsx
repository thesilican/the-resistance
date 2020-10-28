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
  textHeight: number;
  flipped?: boolean;
};

export function PlayerSprite(props: PlayerSpriteProps) {
  const { width, height, textHeight, flipped, index } = props;
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState(false);

  const hat = index === 0;
  const color = ColorOrder[index] ?? ColorOrder[0];
  const colorCode = ColorValues[color];

  // X and Y are anchored in center
  const x = props.x - width / 2;
  const y = props.y - height / 2;

  return (
    <Fragment>
      <Texture
        type={"select"}
        x={x}
        y={y}
        width={width}
        height={height}
        flipped={flipped}
        opacity={selected ? 0.9 : hover ? 0.5 : 0.0}
      />
      <Texture
        type={"stickman"}
        color={color}
        x={x}
        y={y}
        width={width}
        height={height}
        flipped={flipped}
      />
      {hat && (
        <Texture
          type={"hat"}
          x={x}
          y={y}
          width={width}
          height={height}
          flipped={flipped}
        />
      )}
      <Text
        x={x}
        y={y + height}
        width={width}
        height={textHeight}
        fontSize={textHeight}
        fill={colorCode}
        align={"center"}
        text={"Bobby"}
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
