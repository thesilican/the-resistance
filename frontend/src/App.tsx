import React from "react";
import { useSelector } from "react-redux";
import GameView from "./components/game/GameView";
import LobbyView from "./components/lobby/LobbyView";
import WelcomeView from "./components/welcome/WelcomeView";
import { GameSelector, LobbySelector } from "./store";
import styles from "./styles/App.module.scss";

function App() {
  const lobbyID = useSelector(LobbySelector.lobbyID);
  const youInGame = useSelector(GameSelector.youInGame);
  const view = lobbyID === "" ? "welcome" : youInGame ? "game" : "lobby";

  return (
    <div className={styles.App}>
      {view === "game" ? (
        <GameView />
      ) : view === "lobby" ? (
        <LobbyView />
      ) : (
        <WelcomeView />
      )}
    </div>
  );
}

export default App;
