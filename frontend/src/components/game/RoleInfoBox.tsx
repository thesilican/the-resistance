import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import styles from "../../styles/game/RoleInfoBox.module.scss";
import RolesModal from "../common/RolesModal";
import TextTransformer from "../common/TextTransformer";

type RoleInfoBoxProps = {};

export default function RoleInfoBox(props: RoleInfoBoxProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  return (
    <div className={styles.RoleInfoBox}>
      <RolesModal
        show={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      <span>
        <TextTransformer>{`{{name:0}}`}</TextTransformer>
      </span>
      <span>
        <TextTransformer>{`You are a {{fail:spy}}`}</TextTransformer>
      </span>
      <span>
        <TextTransformer>{`{{fail:Spies}} - {{name:0}} {{name:1}}`}</TextTransformer>
      </span>
      <span className={styles.small}>
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
        View Roles List
      </Button>
    </div>
  );
}
