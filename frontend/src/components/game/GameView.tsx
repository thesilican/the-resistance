import cn from "classnames";
import { GameFunc, last } from "common-modules";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Vec2 } from "../../lib/util";
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

function getWindowDim(div: HTMLDivElement | null): Vec2 {
  return [div?.clientWidth ?? 1, div?.clientHeight ?? 1];
}

export default function GameView() {
  const gamePhase = useSelector(GameSelector.gamePhase);
  const numPlayers = useSelector(GameSelector.numPlayers);
  const lastMission = last(useSelector(GameSelector.missionHistory));
  const lastMissionResult = lastMission
    ? GameFunc.util.getMissionResult(lastMission, numPlayers)
    : null;
  const dark = gamePhase === "mission" || gamePhase === "finished-assasinate";
  const flashFail =
    gamePhase === "mission-review" && lastMissionResult === "fail";

  // Handle resizing
  const [gridDim, setGridDim] = useState<Vec2>([1, 1]);
  const gameGridDivRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handler = () => setGridDim(getWindowDim(gameGridDivRef.current));
    // Resize after render
    handler();

    // Handle window resize
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div
      className={cn(styles.GameView, {
        [styles.dark]: dark,
        [styles.fail]: flashFail,
      })}
    >
      <div className={styles.grid} ref={gameGridDivRef}>
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
      <GameCanvas dim={gridDim} />
      <div
        className={cn(styles.background)}
        style={{
          // width: gridDim[0],
          height: gridDim[1],
        }}
      />
    </div>
  );
}
