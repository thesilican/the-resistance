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
        <TextTransformer>{`{{name:0}} - (you) {{fail:Spy}}`}</TextTransformer>
      </span>
      <span>
        <TextTransformer>{`{{name:1}} - {{fail:Spy}}`}</TextTransformer>
      </span>
      <span>
        <TextTransformer>{`{{name:2}} - {{fail:Spy}}`}</TextTransformer>
      </span>
      <span className={styles.small}>
        Roles:
        <br />
        <TextTransformer>
          {`2 {{success:agent}} 1 {{success:captain}}`}
        </TextTransformer>
        <br />
        <TextTransformer>
          {`1 {{fail:spy}} 1 {{fail:assasin}} ` +
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
