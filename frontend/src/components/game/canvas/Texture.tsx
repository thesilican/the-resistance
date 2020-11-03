import { Color, ProposalVote, Role } from "common-modules";
import React, { Fragment } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

export type TextureType = "select" | "hat" | "role" | "stickman" | "vote";

const spritesheetUrl = `${process.env.PUBLIC_URL}/assets/spritesheet.png`;
const SPRITE_W = 400;
const SPRITE_H = 600;

export const textureMap = {
  select: [1, 0],
  hat: [2, 0],
  role: {
    agent: [0, 1],
    captain: [1, 1],
    deputy: [2, 1],
    spy: [3, 1],
    assasin: [4, 1],
    imposter: [5, 1],
    mole: [0, 2],
    intern: [1, 2],
  },
  stickman: {
    red: [2, 2],
    orange: [3, 2],
    yellow: [4, 2],
    green: [5, 2],
    teal: [0, 3],
    cyan: [1, 3],
    blue: [2, 3],
    indigo: [3, 3],
    purple: [4, 3],
    pink: [5, 3],
  },
  vote: {
    none: [3, 0],
    accept: [4, 0],
    reject: [5, 0],
  },
};

type TextureProps = {
  type: TextureType;
  stickmanColor?: Color;
  vote?: ProposalVote;
  role?: Role;
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
    map = textureMap.stickman[props.stickmanColor!];
  } else if (props.type === "role") {
    map = textureMap.role[props.role!];
  } else if (props.type === "vote") {
    map = textureMap.vote[props.vote!];
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
