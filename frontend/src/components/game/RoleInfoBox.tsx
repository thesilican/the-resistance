import { GameAgentRoles, GameFunc } from "common-modules";
import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useSelector } from "react-redux";
import { capital } from "../../lib/util";
import { GameSelector } from "../../store";
import styles from "../../styles/game/RoleInfoBox.module.scss";
import RolesIncludedList from "../common/RolesIncludedList";
import RolesModal from "../common/RolesModal";
import TextTransformer from "../common/TextTransformer";

type RoleInfoBoxProps = {};

export default function RoleInfoBox(props: RoleInfoBoxProps) {
  const index = useSelector(GameSelector.playerIndex);
  const roleList = useSelector(GameSelector.roles);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const knownRolesMap = GameFunc.getKnownRoles(index, roleList);
  const knownRoles = Array.from(knownRolesMap.entries());

  return (
    <div className={styles.RoleInfoBox}>
      <RolesModal
        show={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      {knownRoles.map((x, i) => (
        <span key={i}>
          <TextTransformer>
            {`{{name:${x[0]}}} - ` +
              x[1]
                .map((r) =>
                  GameAgentRoles.includes(r)
                    ? `{{success:${capital(r)}}}`
                    : `{{fail:${capital(r)}}}`
                )
                .join("/")}
          </TextTransformer>
        </span>
      ))}
      <span className={styles.small}>
        <RolesIncludedList rolesList={roleList} />
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
