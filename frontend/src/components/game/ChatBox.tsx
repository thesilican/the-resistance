import cn from "classnames";
import { ChatMessage } from "common-modules";
import React, { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import FormControl from "react-bootstrap/esm/FormControl";
import styles from "../../styles/game/ChatBox.module.scss";
import TextTransformer from "../common/TextTransformer";

let messages: ChatMessage[] = [
  {
    type: "system",
    content: "The mission {{fail:failed}} (1 spy detected)",
  },
  {
    type: "system",
    content: "The mission was {{success:successful}}",
  },
  {
    type: "system",
    content: "The mission {{fail:failed}}",
  },
  ...Array.from(Array(10)).map((_, i) => ({
    type: "player" as "player",
    player: i,
    content: "What is up, my fellow gamerss!!",
  })),
];

type ChatBoxProps = {};

export default function ChatBox(props: ChatBoxProps) {
  const [typingMessage, setTypingMessage] = useState("");
  const handleTypeCharacter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 200) return;
    setTypingMessage(e.target.value);
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setTypingMessage("");
  };

  // Add a global event listener to focus

  return (
    <div className={styles.ChatBox}>
      <div className={styles.chatWrapper}>
        <div className={styles.chat}>
          <ChatMessageList messages={messages} />
        </div>
      </div>
      <Form inline className={styles.form} onSubmit={handleSendMessage}>
        <FormControl
          className={styles.input}
          value={typingMessage}
          onChange={handleTypeCharacter}
          placeholder="Send a message"
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
    <p className={cn(styles.chatMessage, styles.user)}>
      <TextTransformer>{`{{name:${player}}}: ${text}`}</TextTransformer>
    </p>
  );
}

type SystemChatMessageProps = {
  text: string;
};

function SystemChatMessage({ text }: SystemChatMessageProps) {
  return (
    <p className={cn(styles.chatMessage, styles.system)}>
      <TextTransformer>{`${text}`}</TextTransformer>
    </p>
  );
}
