import cn from "classnames";
import { GameFunc, last } from "common-modules";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import { Vec2 } from "../../util";
import GameCanvas from "./canvas/GameCanvas";
import CenterControls from "./CenterControls";
import CornerBox from "./CornerBox";
import s from "./GameView.module.scss";
import MissionIndicators from "./MissionIndicators";
import RoleInfoBox from "./RoleInfoBox";
import StatusMessage from "./StatusMessage";
import TabsBox from "./TabsBox";
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
  const dark = gamePhase === "mission" || gamePhase === "finished-assassinate";
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
      className={cn(s.GameView, {
        [s.dark]: dark,
        [s.fail]: flashFail,
      })}
    >
      <div className={s.grid} ref={gameGridDivRef}>
        <div className={s.col1}>
          <RoleInfoBox />
          <TabsBox />
        </div>
        <div className={s.col2}>
          <TopInfoBar />
          <CenterControls />
          <StatusMessage />
        </div>
        <div className={s.col3}>
          <CornerBox />
          <MissionIndicators />
        </div>
      </div>
      <GameCanvas dim={gridDim} />
      <div
        className={cn(s.background)}
        style={{
          // width: gridDim[0],
          height: gridDim[1],
        }}
      />
    </div>
  );
}
