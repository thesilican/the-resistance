import cn from "classnames";
import { GameFunc } from "common-modules";
import React from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/game/GameView.module.scss";
import GameCanvas from "./canvas/GameCanvas";
import CenterControls from "./CenterControls";
import ChatHistoryTabs from "./ChatHistoryTabs";
import GameRoomCode from "./GameRoomCode";
import MissionIndicators from "./MissionIndicators";
import RoleInfoBox from "./RoleInfoBox";
import StatusMessage from "./StatusMessage";
import TopInfoBar from "./TopInfoBar";

export default function GameView() {
  const gamePhase = useSelector(GameSelector.gamePhase);
  const numPlayers = useSelector(GameSelector.numPlayers);
  const mission = useSelector(GameSelector.missions);
  const lastMission = mission[mission.length - 1];
  const lastMissionResult = lastMission
    ? GameFunc.util.missionResult(lastMission, numPlayers)
    : null;
  const dark = gamePhase === "mission";
  const flashFail =
    gamePhase === "mission-review" && lastMissionResult === "fail";
  const flashSuccess =
    gamePhase === "mission-review" && lastMissionResult === "success";

  return (
    <div
      className={cn(styles.GameView, {
        [styles.dark]: dark,
        [styles.fail]: flashFail,
        [styles.success]: flashSuccess,
      })}
    >
      <div className={styles.grid}>
        <div className={styles.col1}>
          <RoleInfoBox />
          <div />
          <ChatHistoryTabs />
        </div>
        <div className={styles.col2}>
          <TopInfoBar />
          <CenterControls />
          <StatusMessage />
        </div>
        <div className={styles.col3}>
          <GameRoomCode />
          <MissionIndicators />
          <div />
        </div>
      </div>
      <GameCanvas />
    </div>
  );
}
