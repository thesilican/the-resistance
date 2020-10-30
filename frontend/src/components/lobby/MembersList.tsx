import React from "react";
import styles from "../../styles/lobby/MembersList.module.scss";

type MembersListProps = {};

export default function MembersList(props: MembersListProps) {
  return (
    <div className={styles.MembersList}>
      <span className={styles.title}>Room Members (1 player)</span>
      <div className={styles.list}>
        <span className={styles.name}>Bob (Host)</span>
        <span className={styles.name}>Charlie</span>
        <span className={styles.name}>Alice</span>
        <span className={styles.name}>Charlie</span>
        <span className={styles.name}>Charlie</span>
        <span className={styles.name}>Charlie</span>
        <span className={styles.name}>Charlie</span>
        <span className={styles.name}>Charlie</span>
        <span className={styles.name}>Charlie</span>
        <span className={styles.name}>Charlie</span>
      </div>
    </div>
  );
}
