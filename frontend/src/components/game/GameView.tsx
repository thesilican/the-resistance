import React, { useEffect, useState } from "react";
import styles from "../../styles/game/GameView.module.scss";
import ChatHistoryTabs from "./ChatHistoryTabs";
import GameCanvas from "./canvas/GameCanvas";
import GameRoomCode from "./GameRoomCode";
import MissionIndicators from "./MissionIndicators";
import RoleInfoBox from "./RoleInfoBox";
import StatusMessage from "./StatusMessage";
import TopInfoBar from "./TopInfoBar";
import cn from "classnames";

export default function GameView() {
  const [dark, setDark] = useState(false);
  const [flashFail, setFlashFail] = useState(false);
  const [flashSuccess, setFlashSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDark(true);
      setTimeout(() => {
        setDark(false);
        setFlashFail(true);
        setTimeout(() => {
          setFlashFail(false);
        }, 2000);
      }, 3000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
