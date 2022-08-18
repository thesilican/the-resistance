import { LobbyAction } from "common-modules";
import { Fragment } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../store";
import s from "./InGameList.module.scss";

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
    <div className={s.InGameList}>
      <span className={s.title}>In Game ({numPlayers} players)</span>
      <div className={s.list}>
        {gameNames.map((name, i) => {
          const connected = gameConnected[i];
          return (
            <Fragment key={i}>
              <span className={s.name}>
                {name}{" "}
                {!connected && (
                  <span className={s.disconnected}>(disconnected)</span>
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
