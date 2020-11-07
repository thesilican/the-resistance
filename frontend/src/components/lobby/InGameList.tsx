import { LobbyAction } from "common-modules";
import React, { Fragment } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/lobby/InGameList.module.scss";

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
            <Fragment key={i}>
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
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
