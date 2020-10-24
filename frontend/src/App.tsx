import React from "react";
import GameView from "./components/game/GameView";
import styles from "./styles/App.module.scss";

function App() {
  return (
    <div className={styles.App}>
      <GameView />
    </div>
  );
}

export default App;
