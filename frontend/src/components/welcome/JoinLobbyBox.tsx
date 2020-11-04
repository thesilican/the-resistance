import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import styles from "../../styles/welcome/JoinLobbyBox.module.scss";
import { useDispatch } from "react-redux";
import { LobbyAction } from "common-modules";

export default function JoinLobbyBox() {
  const dispatch = useDispatch();
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  // TODO: Add some kind of name verification
  const [isJoin, setisJoin] = useState(true);
  const roomCodeInputRef = useRef(null as HTMLInputElement | null);
  const userNameInputRef = useRef(null as HTMLInputElement | null);

  useEffect(() => {
    if (isJoin) {
      roomCodeInputRef.current?.focus();
    } else {
      userNameInputRef.current?.focus();
    }
  }, [isJoin]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isJoin) {
      dispatch(LobbyAction.clientJoinLobby({ name, roomID: roomCode }));
    } else {
      dispatch(LobbyAction.clientCreateLobby({ name }));
    }
  };

  return (
    <Form className={styles.JoinLobbyBox} onSubmit={handleSubmit}>
      <Form.Group>
        <ButtonGroup className={styles.createJoinBox}>
          <Button
            onClick={() => setisJoin(true)}
            variant={isJoin ? "light" : "outline-light"}
          >
            Join Game
          </Button>
          <Button
            onClick={() => setisJoin(false)}
            variant={isJoin ? "outline-light" : "light"}
          >
            Create Game
          </Button>
        </ButtonGroup>
      </Form.Group>
      {isJoin && (
        <Form.Group controlId="welcome-room-code">
          <Form.Label>Room Code</Form.Label>
          <Form.Control
            required
            ref={roomCodeInputRef}
            value={roomCode}
            onChange={handleRoomCodeChange}
          />
        </Form.Group>
      )}
      <Form.Group controlId="welcome-username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          required
          ref={userNameInputRef}
          value={name}
          onChange={handleNameChange}
        />
      </Form.Group>
      <Button type="submit">{isJoin ? "Join" : "Create"}</Button>
    </Form>
  );
}
