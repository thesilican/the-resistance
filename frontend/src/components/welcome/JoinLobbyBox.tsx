import { LobbyAction } from "common-modules";
import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Form from "react-bootstrap/esm/Form";
import { useDispatch } from "react-redux";
import styles from "../../styles/welcome/JoinLobbyBox.module.scss";

const MAX_NAME_LEN = 15;

export default function JoinLobbyBox() {
  const dispatch = useDispatch();
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
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
    const text = e.target.value;
    if (text.length <= MAX_NAME_LEN) {
      setName(text);
    }
  };
  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // A-Z only
    const formatted = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    if (formatted.length <= 4) {
      setRoomCode(formatted);
    }
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
            placeholder="AAAA"
            ref={roomCodeInputRef}
            value={roomCode}
            onChange={handleRoomCodeChange}
          />
        </Form.Group>
      )}
      <Form.Group controlId="welcome-username">
        <Form.Label className={styles.nameLabel}>
          <span>Name</span> <span>{MAX_NAME_LEN - name.length}</span>
        </Form.Label>
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
