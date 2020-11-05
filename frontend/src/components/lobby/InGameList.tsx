import React from "react";
import styles from "../../styles/lobby/InGameList.module.scss";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../store";
import { LobbyAction } from "common-modules";

export default function InGameList() {
  const dispatch = useDispatch();
  const numPlayers = useSelector(GameSelector.numPlayers);
  const gameNames = useSelector(GameSelector.names);
  const gameConnected = useSelector(GameSelector.socketIDs).map(
    (x) => x !== null
  );

  const handleRejoin = (index: number) => {
    dispatch(LobbyAction.clientRejoinGame({ index }));
  };

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
              {connected ? (
                <div />
              ) : (
                <Button size="sm" onClick={() => handleRejoin(i)}>
                  Rejoin
                </Button>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
