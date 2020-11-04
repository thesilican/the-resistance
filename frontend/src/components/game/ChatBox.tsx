import cn from "classnames";
import { ChatMessage, GameAction } from "common-modules";
import React, { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import FormControl from "react-bootstrap/esm/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/game/ChatBox.module.scss";
import TextTransformer from "../common/TextTransformer";

export default function ChatBox() {
  const dispatch = useDispatch();
  const playerIndex = useSelector(GameSelector.playerIndex);
  const messages = useSelector(GameSelector.chatMessages);
  const [typingMessage, setTypingMessage] = useState("");
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
      setTypingMessage("");
    }
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
