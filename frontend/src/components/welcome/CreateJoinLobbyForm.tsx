import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useSocket } from "../../socket";
import { useStore } from "../../store";

type CreateJoinLobbyFormProps = {};

export default function CreateJoinLobbyForm({}: CreateJoinLobbyFormProps) {
  const socket = useSocket();
  const [store] = useStore();
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [roomID, setRoomID] = useState("");
  const [name, setName] = useState(Math.random() + "");

  useEffect(() => {
    // Get rid of query
    let roomID = new URLSearchParams(window.location.search).get("join");
    if (roomID) {
      setRoomID(roomID);
      setIsJoinRoom(true);
    }
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
      <Form.Group controlId="select">
        <Form.Control
          as="select"
          value={isJoinRoom ? "join" : "create"}
          onChange={(e) => setIsJoinRoom(e.target.value === "join")}
        >
          <option value="create">Create Room</option>
          <option value="join">Join Room</option>
        </Form.Control>
      </Form.Group>
      {isJoinRoom && (
        <Form.Group controlId="roomID">
          <Form.Label>Join Code:</Form.Label>
          <Form.Control
            type="input"
            placeholder="aaaaa"
            value={roomID}
            onFocus={(e: any) => e.target.select()}
            onChange={(e) => setRoomID(e.target.value)}
            required
          />
        </Form.Group>
      )}
      <Form.Group controlId="username">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="input"
          value={name}
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
