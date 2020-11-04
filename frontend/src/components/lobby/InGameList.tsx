import React from "react";
import styles from "../../styles/lobby/InGameList.module.scss";
import Button from "react-bootstrap/esm/Button";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";

export default function InGameList() {
  // TODO: Add ability to rejoin game
  const gameNames = useSelector(GameSelector.names);
  const gameConnected = useSelector(GameSelector.socketIDs).map(
    (x) => x !== null
  );
  const numPlayers = gameNames.length;
  return (
    <div className={styles.InGameList}>
      <span className={styles.title}>In Game ({numPlayers} players)</span>
      <div className={styles.list}>
        {gameNames.map((name, i) => {
          const connected = gameConnected[i];
          return (
            <>
              <span className={styles.name}>
                {name}{" "}
                {!connected && (
                  <span className={styles.disconnected}>(disconnected)</span>
                )}
              </span>
              {connected ? <div /> : <Button size="sm">Rejoin</Button>}
            </>
          );
        })}
      </div>
    </div>
  );
}
