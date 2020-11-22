import {
  GameCustomRoleOptions,
  GameFunc,
  GameMaxPlayers,
  GameMinPlayers,
  LobbyAction,
} from "common-modules";
import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useDispatch, useSelector } from "react-redux";
import { capital } from "../../lib/util";
import { LobbySelector } from "../../store";
import styles from "../../styles/lobby/GameOptions.module.scss";
import RolesIncludedList from "../common/RolesIncludedList";
import RolesModal from "../common/RolesModal";
import TextTransformer from "../common/TextTransformer";

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
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const rolesList = !enoughPlayers
    ? null
    : GameFunc.util.getRoleList(numPlayers, gameOptions);

  const handleToggleGameOption = (gameOption: "captain" | "assassin") => {
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
    <div className={styles.GameOptions}>
      <RolesModal
        show={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      <span className={styles.title}>Game Options</span>
      <div className={styles.optionsBox}>
        <Form.Group id="lobby-gamemode">
          <Form.Label>Game Mode</Form.Label>
          <Form.Control
            className={styles.select}
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
          <>
            <Form.Label>Select roles to use</Form.Label>
            <Form.Group className={styles.rolesBox}>
              {/* Typescript needs a little encouragement */}
              {(["captain", "deputy"] as "captain"[]).map((x: "captain", i) => (
                <Form.Check
                  key={x}
                  type="checkbox"
                  id={`lobby-game-role-agent-${i}`}
                  label={
                    <TextTransformer>{`{{success:${capital(
                      x
                    )}}}`}</TextTransformer>
                  }
                  disabled={!host}
                  checked={gameRoleOptions[x]}
                  onChange={() => handleToggleGameOption(x)}
                />
              ))}
              {(["assassin", "imposter", "mole", "intern"] as "assassin"[]).map(
                (x: "assassin", i) => (
                  <Form.Check
                    key={x}
                    type="checkbox"
                    id={`lobby-game-role-spy-${i}`}
                    label={
                      <TextTransformer>{`{{fail:${capital(
                        x
                      )}}}`}</TextTransformer>
                    }
                    disabled={!host}
                    checked={gameRoleOptions[x]}
                    onChange={() => handleToggleGameOption(x)}
                  />
                )
              )}
            </Form.Group>
          </>
        )}
        {rolesList && (
          <span>
            <RolesIncludedList rolesList={rolesList} />
          </span>
        )}
        <Button
          className={styles.howToPlayButton}
          variant={"secondary"}
          onClick={() => setShowHowToPlay(true)}
          size="sm"
        >
          View Role List
        </Button>
      </div>
      <Button
        className={styles.startButton}
        disabled={!host || !enoughPlayers}
        onClick={handleStartGame}
      >
        Start Game
      </Button>
      {!host && <span>Only the host can start the game</span>}
      {!enoughPlayers && <span>5-10 players can play The Resistance</span>}
    </div>
  );
}
