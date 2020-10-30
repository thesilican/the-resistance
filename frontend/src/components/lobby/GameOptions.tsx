import React, { useState } from "react";
import styles from "../../styles/lobby/GameOptions.module.scss";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import TextTransformer from "../common/TextTransformer";
import RolesModal from "../common/RolesModal";

export default function GameOptions() {
  const [gamemode, setGameMode] = useState("normal");
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [host] = useState(true);

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
            onChange={(e) => setGameMode(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="assasins">Assasins</option>
            <option value="custom">Custom</option>
          </Form.Control>
        </Form.Group>

        {gamemode === "custom" && (
          <>
            <Form.Label>Select roles to use</Form.Label>
            <Form.Group className={styles.rolesBox}>
              {["Captain", "Deputy"].map((x, i) => (
                <Form.Check
                  key={x}
                  type="checkbox"
                  id={`lobby-game-role-agent-${i}`}
                  label={
                    <TextTransformer>{`{{success:${x}}}`}</TextTransformer>
                  }
                  disabled={!host}
                />
              ))}
              {["Assasin", "Imposter", "Mole", "Intern"].map((x, i) => (
                <Form.Check
                  key={x}
                  type="checkbox"
                  id={`lobby-game-role-spy-${i}`}
                  label={<TextTransformer>{`{{fail:${x}}}`}</TextTransformer>}
                  disabled={!host}
                />
              ))}
            </Form.Group>
          </>
        )}
        <span>
          Roles:{" "}
          <TextTransformer>
            {`2 {{success:agent}} 1 {{success:captain}} ` +
              `1 {{fail:spy}} 1 {{fail:assasin}} ` +
              `1 {{fail:spy}} 1 {{fail:assasin}}`}
          </TextTransformer>
        </span>
        <Button
          className={styles.howToPlayButton}
          variant={"secondary"}
          onClick={() => setShowHowToPlay(true)}
          size="sm"
        >
          About Roles
        </Button>
      </div>
      <Button className={styles.startButton} disabled={!host}>
        Start Game
      </Button>
      <span>Only the host can start the game</span>
      <span>5-10 players can play The Resistance</span>
    </div>
  );
}
