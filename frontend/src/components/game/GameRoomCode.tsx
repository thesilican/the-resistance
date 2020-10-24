import React from "react";
import FormControl from "react-bootstrap/esm/FormControl";
import styles from "../../styles/game/GameRoomCode.module.scss";

type GameRoomCodeProps = {};

export default function GameRoomCode(props: GameRoomCodeProps) {
  const gameCode = "ABCD";
  return (
    <div className={styles.GameRoomCode}>
      <span className={styles.label}>Room Code: </span>
      <FormControl
        className={styles.code}
        value={gameCode}
        onClick={(e: React.MouseEvent<HTMLInputElement>) =>
          e.currentTarget.select()
        }
        onChange={() => {}}
      />
    </div>
  );
}
