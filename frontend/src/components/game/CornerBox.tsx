import { Link } from "react-router-dom";
import s from "./CornerBox.module.scss";

export default function CornerBox() {
  return (
    <div className={s.CornerBox}>
      <Link
        className={s.leaveGame}
        to="."
        onClick={() => {
          // TODO: implement
        }}
      >
        Leave Game
      </Link>
    </div>
  );
}
