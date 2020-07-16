import React, { useState, useEffect, isValidElement } from "react";
import { useStore } from "../../store";
import UserList from "./UserList";
import LobbyInvite from "./LobbyInvite";
import { Button } from "react-bootstrap";
import GameView from "../game/GameView";
import { useSocket } from "../../socket";
import { PLAYER_MIN, PLAYER_MAX } from "common-types";

type LobbyViewProps = {};

export default function LobbyView({}: LobbyViewProps) {
  const [state, dispatch] = useStore();
  const socket = useSocket();
  const [url, setURL] = useState("");
  useEffect(() => {
    let base = window.location.href.split("?")[0];
    let url = base.toString() + "?join=" + state.roomID;
    setURL(url);
  }, []);

  if (state.inGame) {
    return <GameView />;
  }

  const validPlayerCount =
    state.roomMembers.length <= PLAYER_MAX &&
    state.roomMembers.length >= PLAYER_MIN;
  const isHost = state.roomIndex === 0;

  return (
    <div className="LobbyView">
      <h1>Lobby View</h1>
      <LobbyInvite roomID={state.roomID} url={url} />
      {state.game && state.game.gamePhase !== "finished" ? (
        <UserList
          title="Game"
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
      {!validPlayerCount && (
        <span>Between 5-10 players can play The Resistance</span>
      )}
      {!isHost && <span>Only the host can start the game</span>}
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
