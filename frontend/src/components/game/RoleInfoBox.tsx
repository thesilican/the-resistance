import { GameFunc } from "common-modules";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import { TName, TRole } from "../common/TextFormat";
import s from "./RoleInfoBox.module.scss";

export default function RoleInfoBox() {
  const index = useSelector(GameSelector.playerIndex);
  const roleList = useSelector(GameSelector.roles);
  const playerIndex = useSelector(GameSelector.playerIndex);
  const knownRoles = Array.from(
    GameFunc.util.getKnownRoles(index, roleList).entries()
  );

  return (
    <div className={s.RoleInfoBox}>
      <div className={s.knownRoles}>
        {knownRoles.map((x, i) => (
          <span key={i}>
            <TName idx={x[0]} /> {playerIndex === x[0] && "(you)"} &ndash;{" "}
            {x[1].map((r, i) => (
              <Fragment key={i}>
                {i !== 0 && " / "}
                <TRole key={i} role={r} />
              </Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
