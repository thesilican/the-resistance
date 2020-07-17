import { ClientAppState, MISSIONS } from "common-types";
import { KonvaEventObject } from "konva/types/Node";
import React, { useState } from "react";
import { Image, Rect, Text } from "react-konva";
import useImage from "use-image";
import spriteSheetResource from "../../../../assets/spritesheet.png";
import { ColorValues, spriteCoords } from "../../../resources";
import { useSocket } from "../../../socket";
import Util from "../../../util";

type PlayerSpriteProps = {
  x: number;
  y: number;
  faceLeft: boolean;
  index: number;
  state: ClientAppState;
};

const IMG_RES_W = 320;
const IMG_RES_H = 480;
const IMG_W = 80;
const IMG_H = 120;
const SPRITE_W = IMG_W;
const SPRITE_H = IMG_H;
const TEXT_TOP_MARGIN = 5;
const TEXT_WIDTH = SPRITE_W + 20;
const Y_ADJUST = 30;
const IMG_CLIP_CORRECTION = 5;

export default function PlayerSprite({
  x,
  y,
  faceLeft,
  index,
  state,
}: PlayerSpriteProps) {
  const socket = useSocket();
  const [spriteSheet] = useImage(spriteSheetResource);
  const [hover, setHover] = useState(false);
  const [name] = useState(state.game?.players[index]);
  if (!state.game) return null;
  const colorOrder = state.game.colorOrder;
  const stickmanCoord =
    spriteCoords.stickman[colorOrder[index % colorOrder.length]][
      faceLeft ? "left" : "right"
    ];
  const hatCoord = spriteCoords.hat[faceLeft ? "left" : "right"];
  const acceptCoord = spriteCoords.vote.accept;
  const rejectCoord = spriteCoords.vote.reject;
  const agentCoord = spriteCoords.agent;
  const spyCoord = spriteCoords.spy;
  const missionNumMembers = Math.abs(
    MISSIONS[state.game.players.length][state.game.missionNumber - 1]
  );

  const canSelect =
    state.game?.gamePhase === "team-building" &&
    state.game.teamLeader === state.game.playerIndex;
  const canHover =
    canSelect && state.game.teamMembers.length < missionNumMembers;
  const selected = state.game.teamMembers.includes(index);

  const showHat = state.game.teamLeader === index;
  const showVotes = state.game.gamePhase === "voting-review";
  const vote =
    state.game.teamHistory[state.game.teamHistory.length - 1]?.votes[index];
  const voteCoord = vote === "accept" ? acceptCoord : rejectCoord;
  const showRole = state.game.gamePhase === "finished";
  const roleCoord = state.game.spies?.includes(index) ? spyCoord : agentCoord;
  const color = ColorValues[state.game.colorOrder[index]];

  const handlePointerEnter = !canHover
    ? undefined
    : (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        setHover(true);
      };
  const handlePointerLeave = !canHover
    ? undefined
    : (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        setHover(false);
      };

  const handlePointerClick = !canSelect
    ? undefined
    : (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        let teamMembers = Util.deepClone(state.game?.teamMembers!);
        if (selected) {
          const i = teamMembers.indexOf(index);
          if (i !== -1) teamMembers.splice(i, 1);
        } else {
          teamMembers.push(index);
        }
        if (
          teamMembers.length >
          Math.abs(
            MISSIONS[state.game!.players.length][state.game!.missionNumber - 1]
          )
        )
          return;
        socket.emit("message", {
          category: "game",
          type: "update-team-proposal",
          teamMembers,
        });
      };

  return (
    <>
      {/* Stickman */}
      <Image
        image={spriteSheet}
        x={x - IMG_W / 2}
        y={y - IMG_H / 2 - Y_ADJUST}
        width={IMG_W}
        height={IMG_H}
        crop={{
          x: stickmanCoord[0] * IMG_RES_W,
          y: stickmanCoord[1] * IMG_RES_H + IMG_CLIP_CORRECTION,
          width: IMG_RES_W,
          height: IMG_RES_H - IMG_CLIP_CORRECTION,
        }}
      ></Image>
      {/* Hat */}
      {showHat && (
        <Image
          image={spriteSheet}
          x={x - IMG_W / 2}
          y={y - IMG_H / 2 - Y_ADJUST}
          width={IMG_W}
          height={IMG_H}
          crop={{
            x: hatCoord[0] * IMG_RES_W,
            y: hatCoord[1] * IMG_RES_H + IMG_CLIP_CORRECTION,
            width: IMG_RES_W,
            height: IMG_RES_H - IMG_CLIP_CORRECTION,
          }}
        ></Image>
      )}
      {/* Vote */}
      {showVotes && vote !== "none" && (
        <Image
          image={spriteSheet}
          x={x - IMG_W / 2}
          y={y - IMG_H / 2 - Y_ADJUST}
          width={IMG_W}
          height={IMG_H}
          crop={{
            x: voteCoord[0] * IMG_RES_W,
            y: voteCoord[1] * IMG_RES_H + IMG_CLIP_CORRECTION,
            width: IMG_RES_W,
            height: IMG_RES_H - IMG_CLIP_CORRECTION,
          }}
        ></Image>
      )}
      {/* Agent/Spy */}
      {showRole && (
        <Image
          image={spriteSheet}
          x={x - IMG_W / 2}
          y={y - IMG_H / 2 - Y_ADJUST}
          width={IMG_W}
          height={IMG_H}
          crop={{
            x: roleCoord[0] * IMG_RES_W,
            y: roleCoord[1] * IMG_RES_H + IMG_CLIP_CORRECTION,
            width: IMG_RES_W,
            height: IMG_RES_H - IMG_CLIP_CORRECTION,
          }}
        ></Image>
      )}
      <Text
        x={x - TEXT_WIDTH / 2}
        y={y + SPRITE_H / 2 - Y_ADJUST + TEXT_TOP_MARGIN}
        text={name}
        width={TEXT_WIDTH}
        fill={color}
        align="center"
        fontSize={18}
      ></Text>

      {/* Hitbox: */}
      {(canSelect || selected) && (
        <Rect
          x={x - SPRITE_W / 2}
          y={y - SPRITE_H / 2 - Y_ADJUST}
          width={SPRITE_W}
          height={SPRITE_H}
          stroke={selected ? "black" : hover ? "#aaaaaa" : "#cccccc"}
          strokeWidth={5}
          onMouseOver={handlePointerEnter}
          onMouseOut={handlePointerLeave}
          onClick={handlePointerClick}
        ></Rect>
      )}
    </>
  );
}
