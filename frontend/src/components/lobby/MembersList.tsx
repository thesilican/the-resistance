import React from "react";
import Button from "react-bootstrap/esm/Button";
import styles from "../../styles/lobby/MembersList.module.scss";

type MembersListProps = {};

export default function MembersList(props: MembersListProps) {
  return (
    <div className={styles.MembersList}>
      <h3>In Game (5 players)</h3>
      <div className={styles.nameList}>
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
      <h3>Room Members</h3>
      <div className={styles.nameList}>
        <span className={styles.name}>Bob</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
        <span className={styles.name}>Charlie</span>
        <div />
      </div>
    </div>
  );
}
