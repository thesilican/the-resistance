import React, { useState } from "react";
import GameView from "./components/game/GameView";
import LobbyView from "./components/lobby/LobbyView";
import WelcomeView from "./components/welcome/WelcomeView";
import styles from "./styles/App.module.scss";

function App() {
  const [view, setView] = useState("game");
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
