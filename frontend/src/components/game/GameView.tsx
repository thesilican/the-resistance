import React from "react";
import GameCanvas from "./canvas/GameCanvas";
import MissionIndicators from "./MissionIndicators";
import InfoTopBar from "./InfoTopBar";
import BottomText from "./BottomText";
import GameLobbyNav from "./GameLobbyNav";
import GameLobbyIDBox from "./GameLobbyIDBox";
import GameChatHistoryTabs from "./ChatHistoryTabs";
import CenterControls from "./CenterControls";

type GameViewProps = {};

export default function GameView({}: GameViewProps) {
  return (
    <div className="GameView">
      <div className="inner-wrapper">
        <GameLobbyNav />
        <InfoTopBar />
        <GameLobbyIDBox />
        <CenterControls />
        <GameChatHistoryTabs />
        <BottomText />
        <MissionIndicators />
      </div>
      <GameCanvas />
    </div>
  );
}
