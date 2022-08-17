import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { GameSelector, LobbySelector } from "../store";
import AboutView from "./about/AboutView";
import GameView from "./game/GameView";
import HowToPlayView from "./how-to-play/HowToPlayView";
import LobbyView from "./lobby/LobbyView";
import WelcomeView from "./welcome/WelcomeView";

export default function App() {
  const lobbyID = useSelector(LobbySelector.lobbyID);
  const navigate = useNavigate();
  useEffect(() => {
    const location = new URL(window.location.href);
    if (lobbyID) {
      location.searchParams.set("join", lobbyID);
    } else {
      location.searchParams.delete("join");
    }
    navigate(location);
  }, [lobbyID, navigate]);

  return (
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/about" element={<AboutView />} />
      <Route path="/how-to-play" element={<HowToPlayView />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function MainView() {
  const lobbyID = useSelector(LobbySelector.lobbyID);
  const youInGame = useSelector(GameSelector.youInGame);
  const view = lobbyID === "" ? "welcome" : youInGame ? "game" : "lobby";

  return view === "game" ? (
    <GameView />
  ) : view === "lobby" ? (
    <LobbyView />
  ) : (
    <WelcomeView />
  );
}
