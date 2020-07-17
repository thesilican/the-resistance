import React, { useEffect, useState, useRef } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { useSocket } from "../../socket";
import { useStore } from "../../store";

type CreateJoinLobbyFormProps = {};

const element = document.createElement("input");

export default function CreateJoinLobbyForm({}: CreateJoinLobbyFormProps) {
  const socket = useSocket();
  const [state] = useStore();
  const [isJoinRoom, setIsJoinRoom] = useState(state.urlRoomID !== "");
  const [roomID, setRoomID] = useState(state.urlRoomID ?? "");
  // const [name, setName] = useState(Math.random() + "");
  const [name, setName] = useState("");
  const ref = useRef(element);

  useEffect(() => {
    // Get rid of query
    let roomID = new URLSearchParams(window.location.search).get("join");
    if (roomID) {
      setRoomID(roomID);
      setIsJoinRoom(true);
    }
    // Select
    ref.current.focus();
  }, []);

  return (
    <Form
      className="welcome-form mb-3 p-3 border rounded"
      onSubmit={(e) => {
        e.preventDefault();
        if (isJoinRoom) {
          socket.emit("message", {
            category: "server",
            type: "join-room",
            name,
            roomID,
          });
        } else {
          socket.emit("message", {
            category: "server",
            type: "create-room",
            name,
          });
        }
      }}
    >
      <Form.Text className="text-center">
        <h1>The&nbsp;Resistance</h1>
      </Form.Text>
      <ButtonGroup aria-label="Basic example" className="select">
        <Button
          onClick={() => setIsJoinRoom(false)}
          variant={isJoinRoom ? "outline-secondary" : "secondary"}
        >
          Create Game
        </Button>
        <Button
          onClick={() => setIsJoinRoom(true)}
          variant={isJoinRoom ? "secondary" : "outline-secondary"}
        >
          Join Game
        </Button>
      </ButtonGroup>
      {isJoinRoom && (
        <Form.Group controlId="roomID">
          <Form.Label>Room Code:</Form.Label>
          <Form.Control
            type="input"
            placeholder="AAAAAA"
            value={roomID}
            onFocus={(e: any) => e.target.select()}
            onChange={(e) => setRoomID(e.target.value)}
            required
          />
        </Form.Group>
      )}
      <Form.Group controlId="username">
        <Form.Label ref={ref}>Username:</Form.Label>
        <Form.Control
          type="input"
          value={name}
          onFocus={(e: any) => e.target.select()}
          onChange={(e) => {
            if (e.target.value.length <= 12) {
              setName(e.target.value);
            }
          }}
          required
        />
      </Form.Group>
      <Button className="w-100" variant="primary" type="submit">
        {isJoinRoom ? "Join" : "Create"}
      </Button>
    </Form>
  );
}
