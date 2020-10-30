import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import styles from "../../styles/welcome/JoinLobbyBox.module.scss";

export default function JoinLobbyBox() {
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

  return (
    <Form className={styles.JoinLobbyBox}>
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
          <Form.Control ref={roomCodeInputRef} />
        </Form.Group>
      )}
      <Form.Group controlId="welcome-username">
        <Form.Label>Username</Form.Label>
        <Form.Control ref={userNameInputRef} />
      </Form.Group>
      <Button type="submit">{isJoin ? "Join" : "Create"}</Button>
    </Form>
  );
}
