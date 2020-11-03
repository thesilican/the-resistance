import cn from "classnames";
import React from "react";
import styles from "../../styles/game/GameRoomCode.module.scss";

export default function GameRoomCode() {
  const gameCode = "ABCDEF";
  return (
    <div className={styles.GameRoomCode}>
      <span className={styles.label}>Room Code: </span>
      <input
        className={cn("form-control", styles.code)}
        size={3}
        value={gameCode}
        readOnly
        onClick={(e) => (e.target as HTMLInputElement).select()}
        onBlur={(e) => e.target.setSelectionRange(0, 0)}
      />
    </div>
  );
}
