import React from "react";
import BottomText from "./BottomText";
import GameCanvas from "./canvas/GameCanvas";
import CenterControls from "./CenterControls";
import GameChatHistoryTabs from "./ChatHistoryTabs";
import GameLobbyIDBox from "./GameLobbyIDBox";
import GameLobbyNav from "./GameLobbyNav";
import InfoTopBar from "./InfoTopBar";
import MissionIndicators from "./MissionIndicators";

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
