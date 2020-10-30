import React from "react";
import styles from "../../styles/game/StatusMessage.module.scss";
import TextTransformer from "../common/TextTransformer";

type StatusMessageProps = {};

export default function StatusMessage(props: StatusMessageProps) {
  return (
    <div className={styles.StatusMessage}>
      <span className={styles.text}>
        <TextTransformer>{`{{name:0}} has selected {{name:0}}, {{name:1}}, {{name:2}}, {{name:3}}`}</TextTransformer>
      </span>
    </div>
  );
}
