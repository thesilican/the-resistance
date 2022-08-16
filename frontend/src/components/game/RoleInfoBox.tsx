import { GameAgentRoles, GameFunc } from "common-modules";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import { capital } from "../../util";
import RolesModal from "../common/RolesModal";
import TextTransformer from "../common/TextFormat";
import s from "./RoleInfoBox.module.scss";

export default function RoleInfoBox() {
  const index = useSelector(GameSelector.playerIndex);
  const roleList = useSelector(GameSelector.roles);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const knownRolesMap = GameFunc.util.getKnownRoles(index, roleList);
  const knownRoles = Array.from(knownRolesMap.entries());

  return (
    <div className={s.RoleInfoBox}>
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
      <span className={s.small}>
        {/* <RolesIncludedList rolesList={roleList} /> */}
      </span>
      <Button
        className={s.howToPlayButton}
        variant={"secondary"}
        onClick={() => setShowHowToPlay(true)}
        size="sm"
      >
        (?) About Roles
      </Button>
    </div>
  );
}
