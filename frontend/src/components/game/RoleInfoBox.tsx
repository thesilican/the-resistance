import React from "react";
import styles from "../../styles/game/RoleInfoBox.module.scss";

type RoleInfoBoxProps = {};

export default function RoleInfoBox(props: RoleInfoBoxProps) {
  return (
    <div className={styles.RoleInfoBox}>
      <h2>Bob</h2>
      <h2>You are an Agent</h2>
      <h2>Bob</h2>
    </div>
  );
}
