import { ChatMessage, Color } from "common-types";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useSocket } from "../../socket";
import { useStore } from "../../store";
import NameTransformer from "./NameTransformer";

const div = document.createElement("div");

export default function ChatBox() {
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
          <ChatMessageList
            names={names}
            messages={messages}
            colors={state.game.colorOrder}
          />
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
  colors: Color[];
};

const ChatMessageList = React.memo(function ({
  messages,
  names,
  colors,
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
            colors={colors}
          />
        ) : (
          <SystemChatMessage
            colors={colors}
            key={i}
            names={names}
            text={m.content}
          />
        )
      )}
    </>
  );
});

type UserChatMessageProps = {
  id: number;
  text: string;
  names: string[];
  colors: Color[];
};

function UserChatMessage({ id, text, names, colors }: UserChatMessageProps) {
  return (
    <div className="ChatMessage">
      <span>
        [
        <NameTransformer names={names} colors={colors}>
          {"[[" + id + "]]"}
        </NameTransformer>
        ] {text}
      </span>
    </div>
  );
}

type SystemChatMessageProps = {
  text: string;
  names: string[];
  colors: Color[];
};

function SystemChatMessage({ text, names, colors }: SystemChatMessageProps) {
  return (
    <div className="ChatMessage system">
      <span>
        <NameTransformer names={names} colors={colors}>
          {text}
        </NameTransformer>
      </span>
    </div>
  );
}
