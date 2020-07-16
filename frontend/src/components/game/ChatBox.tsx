import React, { useState, useRef, useEffect } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";
import NameTransformer from "./NameTransformer";
import { ColorOrder, ColorValues, newColorValues } from "../../resources";
import { ChatMessage } from "common-types";
import { useStore } from "../../store";
import { useSocket } from "../../socket";

type ChatBoxProps = {};

const div = document.createElement("div");

export default function ChatBox({}: ChatBoxProps) {
  const [state] = useStore();
  const socket = useSocket();
  const [input, setInput] = useState("");
  const scrollBarRef = useRef(div);
  if (!state.game) return null;
  const messages = state.game.chatHistory;
  const names = state.game.players;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 120) setInput(e.target.value);
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    socket.emit("message", {
      category: "game",
      type: "send-chat-message",
      content: input,
    });
    setInput("");
    e.preventDefault();
  };

  useEffect(() => {
    let node = scrollBarRef.current;
    if (node && node.scrollHeight - node.scrollTop - 100 < node.clientHeight) {
      node.scrollTop = node.scrollHeight;
    }
  });

  return (
    <div className="ChatBox">
      <div className="chat-wrapper">
        <div className="chat" ref={scrollBarRef}>
          <ChatMessageList names={names} messages={messages} />
        </div>
      </div>
      <Form inline onSubmit={handleFormSubmit}>
        <InputGroup>
          <FormControl
            placeholder="Send a Message"
            aria-label="Send a Message"
            onChange={handleInput}
            value={input}
          />
          <InputGroup.Append>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </div>
  );
}

type ChatMessageListProps = {
  messages: ChatMessage[];
  names: string[];
};

const ChatMessageList = React.memo(function ({
  messages,
  names,
}: ChatMessageListProps) {
  return (
    <>
      {messages.map((m, i) =>
        m.type === "player" ? (
          <UserChatMessage
            key={i}
            names={names}
            id={m.player}
            text={m.content}
          />
        ) : (
          <SystemChatMessage key={i} names={names} text={m.content} />
        )
      )}
    </>
  );
});

type UserChatMessageProps = {
  id: number;
  text: string;
  names: string[];
};

function UserChatMessage({ id, text, names }: UserChatMessageProps) {
  return (
    <div className="ChatMeaage">
      <span>
        <NameTransformer names={names} colors={ColorOrder}>
          {"[[" + id + "]]"}
        </NameTransformer>
        : {text}
      </span>
    </div>
  );
}

type SystemChatMessageProps = {
  text: string;
  names: string[];
};

function SystemChatMessage({ text, names }: SystemChatMessageProps) {
  return (
    <div className="ChatMeaage">
      <span>
        <NameTransformer names={names} colors={ColorOrder}>
          {text}
        </NameTransformer>
      </span>
    </div>
  );
}
