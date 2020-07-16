import React, { useState, useEffect } from "react";
import { Form, FormControl } from "react-bootstrap";
import { useStore } from "../../store";

type GameLobbyIDBoxProps = {};

export default function GameLobbyIDBox({}: GameLobbyIDBoxProps) {
  const [state] = useStore();
  const [url, setURL] = useState("");
  useEffect(() => {
    let base = window.location.href.split("?")[0];
    let url = base.toString() + "?join=" + state.roomID;
    setURL(url);
  }, []);
  return (
    <div className="GameLobbyIDBox">
      <span>Game Code:</span>
      <FormControl
        type="text"
        value={url}
        onChange={(e) => {
          e.preventDefault();
        }}
        onFocus={(e: any) => e.target.select()}
      />
    </div>
  );
}