import { ChatMessage } from "common-modules";
import React from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import FormControl from "react-bootstrap/esm/FormControl";
import InputGroup from "react-bootstrap/esm/InputGroup";
import styles from "../../styles/game/ChatBox.module.scss";

let messages: ChatMessage[] = [
  {
    type: "system",
    content: "Hi",
  },
];
for (let i = 0; i < 5; i++) {
  messages = [...messages, ...messages];
}

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
      {messages.map((m, i) =>
        m.type === "player" ? (
          <UserChatMessage key={i} text={m.content} />
        ) : (
          <SystemChatMessage key={i} text={m.content} />
        )
      )}
    </>
  );
});

type UserChatMessageProps = {
  text: string;
};

function UserChatMessage({ text }: UserChatMessageProps) {
  return (
    <div className="ChatMessage">
      <span>{text}</span>
    </div>
  );
}

type SystemChatMessageProps = {
  text: string;
};

function SystemChatMessage({ text }: SystemChatMessageProps) {
  return (
    <div className="ChatMessage system">
      <span>{text}</span>
    </div>
  );
}
