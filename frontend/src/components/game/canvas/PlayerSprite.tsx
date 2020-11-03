import { Rect, Text } from "react-konva";
import React, { Fragment, useMemo, useState } from "react";
import Texture from "./Texture";
import { ColorOrder, ProposalVote, Role } from "common-modules";
import { ColorValues } from "../../../lib/util";
import { StageInfo } from "./GameCanvas";

export type PlayerSpriteProps = {
  stageInfo: StageInfo;
  index: number;
};

export function PlayerSprite(props: PlayerSpriteProps) {
  const { index, stageInfo } = props;
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState(() => index % 3 === 0);

  // Positioning info

  const hat = index === 1;
  const spriteOpacity = selected ? 1 : 0.25;
  const selectionOpacity = selected ? 1 : hover ? 0.5 : 0.1;

  return (
    <PlayerSpriteTexture
      index={index}
      hat={hat}
      onMouseDown={() => setSelected((x) => !x)}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      role={null}
      vote={null}
      stageInfo={stageInfo}
      spriteOpacity={spriteOpacity}
      selectionOpacity={selectionOpacity}
    />
  );
}

function getPosition(index: number, stageInfo: StageInfo) {
  const stageDim = stageInfo.stageDim;
  const stagePos = stageInfo.stagePos;
  const spriteDim = stageInfo.spriteDim;
  const spritePos = stageInfo.spritePos[index];
  const width = spriteDim[0];
  const height = spriteDim[1];
  const x = stagePos[0] + spritePos[0] - width / 2;
  const y = stagePos[1] + spritePos[1] - height / 2;
  const flipped = spritePos[0] > stageDim[0] / 2;
  const spriteHeight = height * (15 / 17);
  const textHeight = height * (2 / 17);
  return { x, y, width, height, flipped, spriteHeight, textHeight };
}

type PlayerSpriteTexturesProps = {
  index: number;
  stageInfo: StageInfo;
  spriteOpacity?: number;
  selectionOpacity?: number;
  hat: boolean;
  vote: ProposalVote | null;
  role: Role | null;
  onMouseOver: () => void;
  onMouseOut: () => void;
  onMouseDown: () => void;
};

// A component that simply draws the required textures
// Layer of abstraction to help me think
function PlayerSpriteTexture(props: PlayerSpriteTexturesProps) {
  const {
    index,
    stageInfo,
    hat,
    vote,
    role,
    spriteOpacity,
    selectionOpacity,
    onMouseOver,
    onMouseOut,
    onMouseDown,
  } = props;
  const {
    x,
    y,
    width,
    height,
    flipped,
    spriteHeight,
    textHeight,
  } = useMemo(() => getPosition(index, stageInfo), [index, stageInfo]);

  const color = ColorOrder[index] ?? ColorOrder[0];
  const colorCode = ColorValues[color];

  return (
    <Fragment>
      <Texture
        type={"select"}
        x={x}
        y={y}
        width={width}
        height={spriteHeight}
        flipped={flipped}
        opacity={selectionOpacity ?? spriteOpacity ?? 1}
      />
      <Texture
        type={"stickman"}
        stickmanColor={color}
        x={x}
        y={y}
        width={width}
        height={spriteHeight}
        flipped={flipped}
        opacity={spriteOpacity ?? 1}
      />
      {hat && (
        <Texture
          type={"hat"}
          x={x}
          y={y}
          width={width}
          height={spriteHeight}
          flipped={flipped}
          opacity={spriteOpacity ?? 1}
        />
      )}
      {role && (
        <Texture
          type={"role"}
          role={role}
          x={x}
          y={y}
          width={width}
          height={spriteHeight}
        />
      )}
      {vote && (
        <Texture
          type={"vote"}
          vote={vote}
          x={x}
          y={y}
          width={width}
          height={spriteHeight}
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
        opacity={spriteOpacity ?? 1}
      />
      {/* Hitbox */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        // stroke="white"
        onMouseOut={onMouseOut}
        onMouseEnter={onMouseOver}
        onMouseDown={onMouseDown}
      />
      {/* <Rect x={x - 2} y={y - 2} width={4} height={4} fill="red" /> */}
    </Fragment>
  );
}
