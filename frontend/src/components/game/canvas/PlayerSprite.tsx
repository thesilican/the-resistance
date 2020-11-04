import {
  ColorOrder,
  GameAction,
  MissionPlayerCount,
  ProposalVote,
  Role,
} from "common-modules";
import React, { Fragment, useMemo, useState } from "react";
import { Rect, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { ColorValues } from "../../../lib/util";
import { GameSelector } from "../../../store";
import { StageInfo } from "./GameCanvas";
import Texture from "./Texture";

export type PlayerSpriteProps = {
  stageInfo: StageInfo;
  index: number;
};

export function PlayerSprite(props: PlayerSpriteProps) {
  const { index, stageInfo } = props;
  const [hover, setHover] = useState(false);
  // TODO: Refactor maybe
  const dispatch = useDispatch();
  const roles = useSelector(GameSelector.roles);
  const numPlayers = useSelector(GameSelector.numPlayers);
  const names = useSelector(GameSelector.names);
  const gamePhase = useSelector(GameSelector.gamePhase);
  const playerIndex = useSelector(GameSelector.playerIndex);
  const lastTeam = useSelector(GameSelector.lastTeam);
  const curTeamMembers = lastTeam?.members;
  const onTeam = lastTeam?.members.includes(index);
  const isLeader = playerIndex === lastTeam?.leader;
  const teamRequiredPlayers =
    MissionPlayerCount[numPlayers][(lastTeam?.mission ?? 1) - 1];

  // Opacity & stuff
  let hat = lastTeam?.leader === index;
  let spriteOpacity = 1;
  let selectionOpacity = 0;

  switch (gamePhase) {
    case "role-reveal":
      break;
    case "team-building":
    case "team-building-review":
    case "voting":
    case "voting-review":
      if (onTeam) {
        selectionOpacity = 1;
      } else if (gamePhase === "team-building" && isLeader) {
        if (hover && curTeamMembers!.length < teamRequiredPlayers) {
          selectionOpacity = 0.5;
        } else {
          selectionOpacity = 0.1;
        }
      }
      break;
    case "mission":
    case "mission-review":
      if (onTeam) {
        selectionOpacity = 1;
        spriteOpacity = 1;
      } else {
        spriteOpacity = 0.25;
      }
      break;
    case "finished-assasinate":
      // TODO: implement
      break;
    case "finished":
      break;
  }

  const handleClick = () => {
    if (gamePhase === "team-building" && isLeader) {
      if (curTeamMembers?.includes(index)) {
        dispatch(
          GameAction.updateTeamMembers({
            members: curTeamMembers.filter((x) => x !== index),
          })
        );
      } else {
        if (curTeamMembers!.length < teamRequiredPlayers) {
          dispatch(
            GameAction.updateTeamMembers({
              members: [...curTeamMembers!, index],
            })
          );
        }
      }
    }
  };

  // Votes
  let vote: ProposalVote | null = null;
  if (gamePhase === "voting") {
    vote = lastTeam?.votes[index] === "none" ? null : "none";
  } else if (gamePhase === "voting-review") {
    vote = lastTeam?.votes[index] ?? null;
  }

  // Roles
  let role: Role | null = null;
  if (gamePhase === "finished") {
    role = roles[index];
  }

  return (
    <PlayerSpriteTexture
      text={names[index]}
      index={index}
      hat={hat}
      onMouseDown={handleClick}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      role={role}
      vote={vote}
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
  text: string;
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
    text,
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
        text={text}
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
