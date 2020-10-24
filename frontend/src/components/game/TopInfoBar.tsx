import React from "react";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import styles from "../../styles/game/TopInfoBar.module.scss";

type TopInfoBarProps = {};

export default function TopInfoBar(props: TopInfoBarProps) {
  return (
    <div className={styles.TopInfoBar}>
      <h1 className={styles.title}>Progress</h1>
      <ProgressBar className={styles.progress} min={0} max={3} now={1} />
    </div>
  );
}
