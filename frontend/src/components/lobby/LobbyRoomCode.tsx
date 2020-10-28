import React from "react";
import styles from "../../styles/lobby/LobbyRoomCode.module.scss";
import cn from "classnames";

export default function LobbyRoomCode() {
  return (
    <div className={styles.LobbyRoomCode}>
      Room code:{" "}
      <input
        className={cn("form-control", styles.code)}
        size={3}
        onClick={(e) => (e.target as HTMLInputElement).select()}
        value={"ABCDEF"}
      />
    </div>
  );
}
