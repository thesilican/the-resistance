import cn from "classnames";
import { ChatMessage, GameAction } from "common-modules";
import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import FormControl from "react-bootstrap/esm/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../store";
import TextTransformer from "../common/TextFormat";
import s from "./ChatBox.module.scss";

export default function ChatBox() {
  const dispatch = useDispatch();
  const playerIndex = useSelector(GameSelector.playerIndex);
  const messages = useSelector(GameSelector.chatMessages);
  const [typingMessage, setTypingMessage] = useState("");
  const [hasFocus, setHasFocus] = useState(false);
  const chatDivRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  const handleTypeCharacter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 200) return;
    setTypingMessage(e.target.value);
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (typingMessage !== "") {
      dispatch(
        GameAction.newPlayerChatMessage({
          player: playerIndex,
          message: typingMessage,
        })
      );
      // Scroll to the bottom on message
      const div = chatDivRef.current!;
      div.scrollTo(0, div.scrollHeight);
      setTypingMessage("");
    }
  };

  useEffect(() => {
    // Stick to bottom
    const div = chatDivRef.current!;
    if (div.scrollHeight - div.scrollTop - div.clientHeight < 100) {
      div.scrollTo(0, div.scrollHeight);
    }
  }, [messages]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts
      if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === "Tab") {
        chatInputRef.current?.focus();
        e.preventDefault();
      }
      if (e.key === "Escape") {
        chatInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className={s.ChatBox}>
      <div className={s.chatWrapper} ref={chatDivRef}>
        <div className={s.chat}>
          <ChatMessageList messages={messages} />
        </div>
      </div>
      {/* <Form inline className={s.form} onSubmit={handleSendMessage}> */}
      <Form className={s.form} onSubmit={handleSendMessage}>
        <FormControl
          ref={chatInputRef}
          className={s.input}
          value={typingMessage}
          onChange={handleTypeCharacter}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          placeholder={hasFocus ? "Send a message" : "Press Tab to focus"}
        />
      </Form>
    </div>
  );
}

type ChatMessageListProps = {
  messages: ChatMessage[];
};

const ChatMessageList = React.memo(function ({
  messages,
}: ChatMessageListProps) {
  return (
    <>
      {messages.map((msg, i) =>
        msg.type === "player" ? (
          <UserChatMessage key={i} player={msg.player} text={msg.content} />
        ) : (
          <SystemChatMessage key={i} text={msg.content} />
        )
      )}
    </>
  );
});

type UserChatMessageProps = {
  text: string;
  player: number;
};

function UserChatMessage({ player, text }: UserChatMessageProps) {
  return (
    <p className={cn(s.chatMessage, s.user)}>
      <TextTransformer>{`{{name:${player}}}: ${text}`}</TextTransformer>
    </p>
  );
}

type SystemChatMessageProps = {
  text: string;
};

function SystemChatMessage({ text }: SystemChatMessageProps) {
  return (
    <p className={cn(s.chatMessage, s.system)}>
      <TextTransformer>{`${text}`}</TextTransformer>
    </p>
  );
}
