import {
  GameAgentRoles,
  GameCustomRoleOptions,
  GameFunc,
  GameMaxPlayers,
  GameMinPlayers,
  GameRolesOrder,
  LobbyAction,
  Role,
} from "common-modules";
import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LobbySelector } from "../../store";
import RolesModal from "../common/RolesModal";
import { TRole } from "../common/TextFormat";
import s from "./GameOptions.module.scss";

export default function GameOptions() {
  const dispatch = useDispatch();
  const lobbyMembers = useSelector(LobbySelector.lobbyMembers);
  const host = useSelector(LobbySelector.lobbyIsHost);
  const gameOptions = useSelector(LobbySelector.lobbyGameOptions);
  const gamemode = typeof gameOptions === "object" ? "custom" : gameOptions;
  const gameRoleOptions = gameOptions as GameCustomRoleOptions;
  const numPlayers = lobbyMembers.length;
  const enoughPlayers =
    numPlayers >= GameMinPlayers && numPlayers <= GameMaxPlayers;

  const rolesList = !enoughPlayers
    ? null
    : GameFunc.util.getRoleList(numPlayers, gameOptions);

  const handleToggleGameOption = (gameOption: keyof GameCustomRoleOptions) => {
    dispatch(
      LobbyAction.updateGameOptions({
        options: {
          ...gameRoleOptions,
          [gameOption]: !gameRoleOptions[gameOption],
        },
      })
    );
  };

  const handleSetGameMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const options =
      e.target.value === "normal"
        ? "normal"
        : e.target.value === "assassins"
        ? "assassins"
        : {
            captain: true,
            deputy: false,
            assassin: true,
            imposter: false,
            intern: false,
            mole: false,
          };
    dispatch(LobbyAction.updateGameOptions({ options }));
  };

  const handleStartGame = () => {
    dispatch(LobbyAction.clientStartGame());
  };

  return (
    <>
      <div className={s.GameOptions}>
        <span className={s.title}>Game Options</span>
        <div className={s.optionsBox}>
          <Form.Group id="lobby-gamemode">
            <Form.Label>Game Mode</Form.Label>
            <Form.Control
              className={s.select}
              as="select"
              value={gamemode}
              disabled={!host}
              onChange={handleSetGameMode}
            >
              <option value="normal">Normal</option>
              <option value="assassins">Assassins</option>
              <option value="custom">Custom</option>
            </Form.Control>
          </Form.Group>

          {gamemode === "custom" && (
            <CustomRolesSelection
              readOnly={!host}
              roles={gameRoleOptions}
              onToggle={handleToggleGameOption}
            />
          )}
          {rolesList && <RolesList roles={rolesList} />}
          <Button
            className={s.startButton}
            disabled={!host || !enoughPlayers}
            onClick={handleStartGame}
          >
            Start Game
          </Button>
          {!enoughPlayers && <span>5-10 players can play The Resistance</span>}
        </div>
      </div>
    </>
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
      <span>Roles</span>
      <br />
      {agents.map((x, i) => (
        <Fragment key={i}>
          {x[1]}&nbsp;
          <TRole role={x[0]} />{" "}
        </Fragment>
      ))}
      <br />
      {spies.map((x, i) => (
        <Fragment key={i}>
          {x[1]}&nbsp;
          <TRole role={x[0]} />{" "}
        </Fragment>
      ))}
      <br />
      <Link
        className={s.aboutRoles}
        to="."
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

type CustomRolesSelectionProps = {
  readOnly: boolean;
  roles: GameCustomRoleOptions;
  onToggle: (role: keyof GameCustomRoleOptions) => void;
};
function CustomRolesSelection(props: CustomRolesSelectionProps) {
  const agentRoles = ["captain", "deputy"] as const;
  const spyRoles = ["assassin", "imposter", "intern", "mole"] as const;
  return (
    <div>
      <Form.Label>Select roles to use</Form.Label>
      <Form.Group className={s.rolesBox}>
        {agentRoles.map((x, i) => (
          <Form.Check
            key={x}
            type="checkbox"
            id={`lobby-game-role-agent-${i}`}
            label={<TRole role={x} />}
            disabled={props.readOnly}
            checked={props.roles[x]}
            onChange={() => props.onToggle(x)}
          />
        ))}
        {spyRoles.map((x, i) => (
          <Form.Check
            key={x}
            type="checkbox"
            id={`lobby-game-role-spy-${i}`}
            label={<TRole role={x} />}
            disabled={props.readOnly}
            checked={props.roles[x]}
            onChange={() => props.onToggle(x)}
          />
        ))}
      </Form.Group>
    </div>
  );
}
