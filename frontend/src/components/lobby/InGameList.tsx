import React from "react";
import styles from "../../styles/lobby/InGameList.module.scss";
import Button from "react-bootstrap/esm/Button";

export default function InGameList() {
  return (
    <div className={styles.InGameList}>
      <span className={styles.title}>In Game (5 players)</span>
      <div className={styles.list}>
        <span className={styles.name}>
          Bobbbbb <span className={styles.disconnected}>(disconnected)</span>
        </span>
        <Button size="sm">Rejoin</Button>
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>David</span>
        <div />
        <span className={styles.name}>
          Edward <span className={styles.disconnected}>(disconnected)</span>
        </span>
        <Button size="sm">Rejoin</Button>
        <span className={styles.name}>
          Edward <span className={styles.disconnected}>(disconnected)</span>
        </span>
        <Button size="sm">Rejoin</Button>
      </div>
    </div>
  );
}
