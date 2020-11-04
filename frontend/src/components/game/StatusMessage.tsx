import React from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/game/StatusMessage.module.scss";
import TextTransformer from "../common/TextTransformer";

export default function StatusMessage() {
  const statusMessage = useSelector(GameSelector.statusMessage);
  return (
    <div className={styles.StatusMessage}>
      <span className={styles.text}>
        <TextTransformer>{statusMessage ?? ""}</TextTransformer>
      </span>
    </div>
  );
}
