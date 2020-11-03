import React from "react";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import styles from "../../styles/game/TopInfoBar.module.scss";

export default function TopInfoBar() {
  return (
    <div className={styles.TopInfoBar}>
      <span className={styles.title}>Mission 2 - Team Building</span>
      <ProgressBar
        className={styles.progress}
        variant="primary"
        min={0}
        max={3}
        now={1}
      />
    </div>
  );
}
