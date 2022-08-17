import cn from "classnames";
import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LobbySelector } from "../../store";
import s from "./LobbyRoomCode.module.scss";

export default function LobbyRoomCode() {
  const roomCode = useSelector(LobbySelector.lobbyID);
  const url = new URL(window.location.href);
  url.searchParams.set("join", roomCode);
  return (
    <div className={s.LobbyRoomCode}>
      <InputGroup size="sm">
        <Form.Control
          className={s.code}
          readOnly
          value={url.toString()}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <Button
          variant="outline-light"
          onClick={() => navigator.clipboard.writeText(url.toString())}
        >
          Copy
        </Button>
      </InputGroup>
    </div>
  );
}
