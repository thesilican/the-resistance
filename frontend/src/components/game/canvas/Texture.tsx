import { Color } from "common-modules";
import React, { Fragment } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

export type TextureType = "hat" | "stickman" | "select";

const spritesheetUrl = `${process.env.PUBLIC_URL}/assets/spritesheet.png`;
const SPRITE_W = 400;
const SPRITE_H = 600;

export const textureMap = {
  select: [1, 0],
  hat: [2, 0],
  stickman: {
    red: [3, 0],
    orange: [4, 0],
    yellow: [5, 0],
    green: [0, 1],
    teal: [1, 1],
    cyan: [2, 1],
    blue: [3, 1],
    indigo: [4, 1],
    purple: [5, 1],
    pink: [0, 2],
  },
};

type TextureProps = {
  type: TextureType;
  color?: Color;
  x: number;
  y: number;
  width: number;
  height: number;
  flipped?: boolean;
  opacity?: number;
};

export default function Texture(props: TextureProps) {
  const [image, state] = useImage(spritesheetUrl);
  if (state !== "loaded") {
    return <Fragment />;
  }

  let map: number[];
  if (props.type === "stickman") {
    map = textureMap.stickman[props.color!];
  } else {
    map = textureMap[props.type];
  }

  return (
    <Image
      image={image}
      x={props.flipped ? props.x + props.width : props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      crop={{
        x: map[0] * SPRITE_W,
        y: map[1] * SPRITE_H,
        width: SPRITE_W,
        height: SPRITE_H,
      }}
      scaleX={props.flipped ? -1 : 1}
      opacity={props.opacity}
    ></Image>
  );
}
