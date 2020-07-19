import React, { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { useStore } from "../../store";

export default function GameLobbyIDBox() {
  const [state] = useStore();
  return (
    <div className="GameLobbyIDBox">
      <span>Game Code:</span>
      <FormControl
        type="text"
        value={state.roomID}
        onChange={(e) => {
          e.preventDefault();
        }}
        onFocus={(e: any) => e.target.select()}
      />
    </div>
  );
}
