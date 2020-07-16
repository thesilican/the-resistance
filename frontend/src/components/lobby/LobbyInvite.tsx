import React from "react";
import { FormControl } from "react-bootstrap";
import { useLocation } from "react-router-dom";

type LobbyInviteProps = {
  roomID: string;
  url: string;
};

export default function LobbyInvite({ roomID, url }: LobbyInviteProps) {
  return (
    <div className="LobbyInvite">
      <div className="d-flex flex-row align-items-center">
        <span className="title mr-3">Lobby Join Code:</span>
        <span className="room-id">{roomID}</span>
      </div>
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
