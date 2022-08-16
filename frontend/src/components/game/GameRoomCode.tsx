import cn from "classnames";
import { useSelector } from "react-redux";
import { LobbySelector } from "../../store";
import s from "./GameRoomCode.module.scss";

export default function GameRoomCode() {
  const gameCode = useSelector(LobbySelector.lobbyID);
  return (
    <div className={s.GameRoomCode}>
      <span className={s.label}>Room Code: </span>
      <input
        className={cn("form-control", s.code)}
        size={3}
        value={gameCode}
        readOnly
        onClick={(e) => (e.target as HTMLInputElement).select()}
        onBlur={(e) => e.target.setSelectionRange(0, 0)}
      />
    </div>
  );
}
