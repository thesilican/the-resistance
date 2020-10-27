import { ChatMessage } from "common-modules";
import React from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import FormControl from "react-bootstrap/esm/FormControl";
import InputGroup from "react-bootstrap/esm/InputGroup";
import styles from "../../styles/game/ChatBox.module.scss";
import TextTransformer from "./TextTransformer";
import cn from "classnames";

let messages: ChatMessage[] = [
  {
    type: "system",
    content: "Hi",
  },
  ...Array.from(Array(10)).map((_, i) => ({
    type: "player" as "player",
    player: i,
    content: "What is up, my fellow gamerss!!",
  })),
];

type ChatBoxProps = {};

export default function ChatBox(props: ChatBoxProps) {
  return (
    <div className={styles.ChatBox}>
      <div className={styles.chatWrapper}>
        <div className={styles.chat}>
          <ChatMessageList messages={messages} />
        </div>
      </div>
      <Form inline className={styles.form}>
        <InputGroup className={styles.inputGroup}>
          <FormControl
            className={styles.input}
            placeholder="Send a Message"
            aria-label="Send a Message"
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
      <TextTransformer>{`[{{name:${player}}}] ${text}`}</TextTransformer>
    </p>
  );
}

type SystemChatMessageProps = {
  text: string;
};

function SystemChatMessage({ text }: SystemChatMessageProps) {
  return (
    <p className={cn(styles.chatMessage, styles.system)}>
      <TextTransformer>{`[{{success:System}}] ${text}`}</TextTransformer>
    </p>
  );
}
