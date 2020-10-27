import React, { Fragment } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

export type TextureType = "hat" | "stickman" | "select";

const spritesheetUrl = `${process.env.PUBLIC_URL}/assets/spritesheet.png`;
const SPRITE_W = 400;
const SPRITE_H = 600;

export const textureMap = {
  hat: [1, 1],
  stickman: [0, 1],
  select: [1, 0],
};

type TextureProps = {
  type: TextureType;
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

  const map = textureMap[props.type];

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
