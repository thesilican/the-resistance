import { plural } from "common-modules";
import { useSelector } from "react-redux";
import { LobbySelector } from "../../store";
import s from "./MembersList.module.scss";

export default function MembersList() {
  const names = useSelector(LobbySelector.lobbyNames);

  return (
    <div className={s.MembersList}>
      <span className={s.title}>
        Lobby Members ({plural(names.length, "player")})
      </span>
      <div className={s.list}>
        {names.map((n, i) => (
          <span key={i} className={s.name}>
            {n}
            {i === 0 ? " (Host)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
