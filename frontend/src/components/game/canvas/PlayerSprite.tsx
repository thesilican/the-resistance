import {
  Color,
  GameAction,
  GameAgentRoles,
  GameFunc,
  last,
  MissionPlayerCount,
  ProposalVote,
  Role,
} from "common-modules";
import { Fragment, useMemo, useState } from "react";
import { Rect, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../../store";
import { ColorValues } from "../../../util";
import { StageInfo } from "./GameCanvas";
import Texture from "./Texture";

export type PlayerSpriteProps = {
  stageInfo: StageInfo;
  index: number;
};

export function PlayerSprite(props: PlayerSpriteProps) {
  const { index, stageInfo } = props;
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const roles = useSelector(GameSelector.roles);
  const numPlayers = useSelector(GameSelector.numPlayers);
  const names = useSelector(GameSelector.names);
  const gamePhase = useSelector(GameSelector.gamePhase);
  const playerIndex = useSelector(GameSelector.playerIndex);
  const color = GameFunc.util.getColorOrder(names)[index];

  const team = useSelector(GameSelector.team);
  const teamHistory = useSelector(GameSelector.teamHistory);
  const isLeader = playerIndex === team?.leader;
  const onTeam = team?.members.includes(index);
  const teamRequiredPlayers =
    MissionPlayerCount[numPlayers][(team?.mission ?? 1) - 1];

  const mission = useSelector(GameSelector.mission);
  const onMission = mission?.members.includes(index);

  const isAssassin = useSelector(GameSelector.playerRole) === "assassin";
  const assassinChoice = useSelector(GameSelector.assassinChoice);
  const canAssassinate = GameAgentRoles.includes(roles[index]);

  const socketIDs = useSelector(GameSelector.socketIDs);
  const disconnected = socketIDs[index] === null;

  // Opacity & stuff
  let hat = team?.leader === index;
  let spriteOpacity = 1;
  let selectionOpacity = 0;

  switch (gamePhase) {
    case "role-reveal":
      break;
    case "team-building":
    case "team-building-review":
    case "voting":
      if (onTeam) {
        selectionOpacity = 1;
      } else if (gamePhase === "team-building" && isLeader) {
        if (hover && team!.members.length < teamRequiredPlayers) {
          selectionOpacity = 0.5;
        } else {
          selectionOpacity = 0.1;
        }
      }
      break;
    case "voting-review":
      if (last(teamHistory)?.members.includes(index)) {
        selectionOpacity = 1;
      }
      break;
    case "mission":
      if (onMission) {
        selectionOpacity = 1;
        spriteOpacity = 1;
      } else {
        spriteOpacity = 0.25;
      }
      break;
    case "mission-review":
      break;
    case "finished-assassinate":
      if (index === assassinChoice) {
        selectionOpacity = 1;
      } else if (isAssassin && canAssassinate) {
        if (hover) {
          selectionOpacity = 0.5;
        } else {
          selectionOpacity = 0.1;
        }
      }
      break;
    case "finished":
      break;
  }

  const handleClick = () => {
    if (gamePhase === "team-building" && isLeader) {
      if (team!.members.includes(index)) {
        dispatch(
          GameAction.updateTeamMembers({
            members: team!.members.filter((x) => x !== index),
          })
        );
      } else {
        if (team!.members.length < teamRequiredPlayers) {
          dispatch(
            GameAction.updateTeamMembers({
              members: [...team!.members, index],
            })
          );
        }
      }
    } else if (
      gamePhase === "finished-assassinate" &&
      isAssassin &&
      canAssassinate
    ) {
      dispatch(GameAction.updateAssassinChoice({ player: index }));
    }
  };

  // Votes
  let vote: ProposalVote | null = null;
  if (gamePhase === "voting") {
    vote = team!.votes[index] === "none" ? null : "none";
  } else if (gamePhase === "voting-review") {
    vote = last(teamHistory)?.votes[index] ?? null;
    if (vote === "none") vote = null;
  }

  // Roles
  let role: Role | null = null;
  if (gamePhase === "finished-assassinate") {
    if (GameAgentRoles.includes(roles[index])) {
      role = "agent";
    } else {
      role = roles[index];
    }
  } else if (gamePhase === "finished") {
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
      color={color}
      stageInfo={stageInfo}
      spriteOpacity={spriteOpacity}
      selectionOpacity={selectionOpacity}
      disconnected={disconnected}
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
  color: Color;
  hat: boolean;
  vote: ProposalVote | null;
  role: Role | null;
  disconnected: boolean;
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
    color,
    onMouseOver,
    onMouseOut,
    onMouseDown,
    disconnected,
    text,
  } = props;
  const { x, y, width, height, flipped, spriteHeight, textHeight } = useMemo(
    () => getPosition(index, stageInfo),
    [index, stageInfo]
  );

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
      {disconnected && (
        <Texture
          type={"disconnect"}
          x={x}
          y={y}
          width={width}
          height={spriteHeight}
          flipped={flipped}
          opacity={spriteOpacity ?? 1}
        />
      )}
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
