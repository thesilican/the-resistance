import React from "react";
import styles from "../../styles/lobby/LobbyRoomCode.module.scss";
import cn from "classnames";
import { useSelector } from "react-redux";
import { LobbySelector } from "../../store";

export default function LobbyRoomCode() {
  const roomCode = useSelector(LobbySelector.lobbyID);
  return (
    <div className={styles.LobbyRoomCode}>
      <span className={styles.label}>Room code: </span>
      <input
        className={cn("form-control", styles.code)}
        size={3}
        onClick={(e) => (e.target as HTMLInputElement).select()}
        value={roomCode}
        onChange={() => {}}
      />
    </div>
  );
}
