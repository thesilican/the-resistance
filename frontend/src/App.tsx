import React, { useState } from "react";
import GameView from "./components/game/GameView";
import LobbyView from "./components/lobby/LobbyView";
import styles from "./styles/App.module.scss";

function App() {
  const [view, setView] = useState("lobby");
  return (
    <div className={styles.App}>
      {view === "game" ? <GameView /> : view === "lobby" ? <LobbyView /> : null}
    </div>
  );
}

export default App;
