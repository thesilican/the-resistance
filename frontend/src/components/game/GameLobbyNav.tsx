import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useStore } from "../../store";
import { useSocket } from "../../socket";

type GameLobbyNavProps = {};

export default function GameLobbyNav({}: GameLobbyNavProps) {
  const [state] = useStore();
  const socket = useSocket();
  const [active, setActive] = useState(false);
  if (!state.game) return null;
  const handleLeaveClick = () => {
    if (state.game?.gamePhase === "finished") {
      socket.emit("message", {
        category: "lobby",
        type: "leave-game",
      });
    } else {
      setActive(true);
    }
  };
  const handleConfirmClick = () => {
    socket.emit("message", {
      category: "lobby",
      type: "leave-game",
    });
  };
  const handleCancelClick = () => {
    setActive(false);
  };

  return (
    <div className="GameLobbyNav">
      {active ? (
        <div className="d-flex flex-row">
          <span>Leave Game?</span>
          <div className="buttons">
            <Button variant="danger" onClick={handleConfirmClick}>
              Leave
            </Button>
            <Button variant="outline-secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button variant="outline-primary" onClick={handleConfirmClick}>
            Return to Lobby
          </Button>
        </div>
      )}
    </div>
  );
}
