import React from "react";
import { useSelector } from "react-redux";
import { plural } from "../../lib/util";
import { LobbySelector } from "../../store";
import styles from "../../styles/lobby/MembersList.module.scss";

export default function MembersList() {
  const lobbyIndex = useSelector(LobbySelector.lobbyIndex);
  const names = useSelector(LobbySelector.lobbyNames);

  return (
    <div className={styles.MembersList}>
      <span className={styles.title}>
        Room Members ({plural(names.length, "player")})
      </span>
      <div className={styles.list}>
        {names.map((n, i) => (
          <span key={i} className={styles.name}>
            {n}
            {i === 0 ? " (Host)" : ""}
            {i === lobbyIndex ? " (You)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
