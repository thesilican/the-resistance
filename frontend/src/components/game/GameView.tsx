import React from "react";
import styles from "../../styles/game/GameView.module.scss";
import ChatHistoryTabs from "./ChatHistoryTabs";
import GameCanvas from "./canvas/GameCanvas";
import GameRoomCode from "./GameRoomCode";
import MissionIndicators from "./MissionIndicators";
import RoleInfoBox from "./RoleInfoBox";
import StatusMessage from "./StatusMessage";
import TopInfoBar from "./TopInfoBar";

export default function GameView() {
  return (
    <div className={styles.GameView}>
      <div className={styles.grid}>
        <div className={styles.col1}>
          <RoleInfoBox />
          <div />
          <ChatHistoryTabs />
        </div>
        <div className={styles.col2}>
          <TopInfoBar />
          <div />
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
