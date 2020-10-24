import React from "react";
import styles from "../../styles/game/StatusMessage.module.scss";

type StatusMessageProps = {};

export default function StatusMessage(props: StatusMessageProps) {
  return (
    <div className={styles.StatusMessage}>
      <h2 className={styles.text}>Hello World</h2>
    </div>
  );
}
