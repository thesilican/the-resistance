import { GameAgentRoles, GameFunc, GameRolesOrder, Role } from "common-modules";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GameSelector } from "../../store";
import RolesModal from "../common/RolesModal";
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
      <RolesList roles={roleList} />
    </div>
  );
}

type RolesListProps = {
  roles: Role[];
};
function RolesList(props: RolesListProps) {
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const rolesMap = new Map<Role, number>();
  for (const role of props.roles) {
    const val = rolesMap.get(role) ?? 0;
    rolesMap.set(role, val + 1);
  }
  const roles = Array.from(rolesMap.entries()).sort(
    (a, b) => GameRolesOrder.indexOf(a[0]) - GameRolesOrder.indexOf(b[0])
  );
  const agents = roles.filter((x) => GameAgentRoles.includes(x[0]));
  const spies = roles.filter((x) => !GameAgentRoles.includes(x[0]));
  return (
    <div className={s.rolesList}>
      <span>Roles List</span>
      <span>
        {agents.map((x, i) => (
          <Fragment key={i}>
            {x[1]}&nbsp;
            <TRole role={x[0]} />{" "}
          </Fragment>
        ))}
      </span>
      <span>
        {spies.map((x, i) => (
          <Fragment key={i}>
            {x[1]}&nbsp;
            <TRole role={x[0]} />{" "}
          </Fragment>
        ))}
      </span>
      <Link
        className={s.aboutRoles}
        to="/"
        onClick={() => setRolesModalOpen(true)}
      >
        About Roles
      </Link>
      <RolesModal
        show={rolesModalOpen}
        onClose={() => setRolesModalOpen(false)}
      />
    </div>
  );
}
