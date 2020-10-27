import React from "react";
import styles from "../../styles/game/RoleInfoBox.module.scss";
import TextTransformer from "./TextTransformer";

type RoleInfoBoxProps = {};

export default function RoleInfoBox(props: RoleInfoBoxProps) {
  return (
    <div className={styles.RoleInfoBox}>
      <span>
        <TextTransformer>{`{{name:0}}`}</TextTransformer>
      </span>
      <span>
        <TextTransformer>{`You are a {{fail:spy}}`}</TextTransformer>
      </span>
      <span>
        <TextTransformer>{`{{fail:Spies}} - {{name:0}} {{name:1}}`}</TextTransformer>
      </span>
    </div>
  );
}
