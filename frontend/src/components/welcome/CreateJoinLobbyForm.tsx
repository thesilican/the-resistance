import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { useSocket } from "../../socket";
import { useStore } from "../../store";

const element = document.createElement("input");

export default function CreateJoinLobbyForm() {
  const socket = useSocket();
  const [state] = useStore();
  const [isJoinRoom, setIsJoinRoom] = useState(state.urlRoomID !== "");
  const [roomID, setRoomID] = useState(state.urlRoomID ?? "");
  const storageName = window.localStorage.getItem("username");
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
      className="welcome-form"
      onSubmit={(e) => {
        e.preventDefault();
        window.localStorage.setItem("username", name);
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
      {/* <Form.Text className="text-center">
        <h1>The&nbsp;Resistance</h1>
      </Form.Text> */}
      <ButtonGroup aria-label="Basic example" className="select">
        <Button
          onClick={() => setIsJoinRoom(false)}
          variant={isJoinRoom ? "outline-primary" : "primary"}
        >
          Create Game
        </Button>
        <Button
          onClick={() => setIsJoinRoom(true)}
          variant={isJoinRoom ? "primary" : "outline-primary"}
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
          />
        </Form.Group>
      )}
      <Form.Group controlId="username">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          ref={ref}
          type="input"
          value={name}
          onFocus={(e: any) => e.target.select()}
          onChange={(e) => {
            if (e.target.value.length <= 12) {
              setName(e.target.value);
            }
          }}
        />
      </Form.Group>
      <Button
        className="w-100"
        variant="primary"
        type="submit"
        disabled={name === "" || (isJoinRoom && roomID === "")}
      >
        {isJoinRoom ? "Join" : "Create"}
      </Button>
    </Form>
  );
}
