import { PLAYER_MAX, PLAYER_MIN } from "common-types";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSocket } from "../../socket";
import { useStore } from "../../store";
import GameView from "../game/GameView";
import LobbyInvite from "./LobbyInvite";
import UserList from "./UserList";

type LobbyViewProps = {};

export default function LobbyView({}: LobbyViewProps) {
  const [state, dispatch] = useStore();
  const socket = useSocket();
  const [url, setURL] = useState("");
  useEffect(() => {
    let base = window.location.href;
    let url = base.toString() + "join/" + state.roomID;
    setURL(url);
  }, []);

  if (state.inGame) {
    return <GameView />;
  }

  const validPlayerCount =
    state.roomMembers.length <= PLAYER_MAX &&
    state.roomMembers.length >= PLAYER_MIN;
  const isHost = state.roomIndex === 0;
  const gameInProgress = state.game !== null;
  const waitingToLeaveGame = state.game?.gamePhase === "finished";

  return (
    <div className="LobbyView">
      {state.game && !waitingToLeaveGame ? (
        <UserList
          title="Game in progress"
          index={-1}
          host={-1}
          names={state.game.players}
          showReconnect={true}
          reconnect={state.game.playerDisconnected}
          onReconnect={(i) => {
            socket.emit("message", {
              category: "lobby",
              type: "rejoin-game",
              index: i,
            });
          }}
        />
      ) : (
        <UserList
          title="Lobby"
          host={0}
          index={state.roomIndex}
          names={state.roomMembers}
          showReconnect={false}
        />
      )}
      <LobbyInvite roomID={state.roomID} url={url} />
      {!gameInProgress && !validPlayerCount && (
        <span>Between 5-10 players can play The Resistance</span>
      )}
      {!gameInProgress && validPlayerCount && !isHost && (
        <span>Waiting for host to start game</span>
      )}
      {waitingToLeaveGame && <span>Waiting for all players to leave game</span>}
      {state.game === null && (
        <Button
          className="my-3"
          disabled={!validPlayerCount || !isHost}
          onClick={() =>
            socket.emit("message", {
              category: "lobby",
              type: "start-game",
            })
          }
        >
          Start Game
        </Button>
      )}
      <span>
        Tip: If the game interface looks too small or too big,
        <br /> you can try zooming in/out in your browser
      </span>
    </div>
  );
}
