import { GameAgentRoles, GameRolesOrder, Role } from "common-modules";
import { Fragment, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { GameSelector, LobbySelector } from "../../store";
import { ButtonLink } from "../common/ButtonLink";
import RolesModal from "../common/RolesModal";
import { TRole } from "../common/TextFormat";
import s from "./GameInfoBox.module.scss";

export default function GameInfoBox() {
  const roleList = useSelector(GameSelector.roles);
  const gameOptions = useSelector(LobbySelector.lobbyGameOptions);
  const gameMode =
    gameOptions === "normal"
      ? "Normal"
      : gameOptions === "assassins"
      ? "Assassins"
      : "Custom";

  return (
    <div className={s.GameInfoBox}>
      <span>Game Mode: {gameMode}</span>
      <RolesList roles={roleList} />
      <LobbyCopyURL />
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
      <span>Roles List:</span>
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
      <ButtonLink onClick={() => setRolesModalOpen(true)}>
        About Roles
      </ButtonLink>
      <RolesModal
        show={rolesModalOpen}
        onClose={() => setRolesModalOpen(false)}
      />
    </div>
  );
}

function LobbyCopyURL() {
  const roomCode = useSelector(LobbySelector.lobbyID);
  const url = new URL(window.location.href);
  url.searchParams.set("join", roomCode);
  return (
    <div>
      <span>Game Link:</span>
      <InputGroup size="sm">
        <Form.Control
          readOnly
          value={url.toString()}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <Button
          variant="outline-light"
          onClick={() => navigator.clipboard.writeText(url.toString())}
        >
          Copy
        </Button>
      </InputGroup>
    </div>
  );
}
