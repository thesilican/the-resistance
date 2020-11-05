import cn from "classnames";
import {
  GameFunc,
  MissionHistory,
  MissionNeedDouble,
  MissionPlayerCount,
} from "common-modules";
import React from "react";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { useSelector } from "react-redux";
import { plural } from "../../lib/util";
import { GameSelector } from "../../store";
import styles from "../../styles/game/MissionIndicators.module.scss";
import TF from "../common/TextTransformer";

export default function MissionIndicators() {
  const missions = Array.from(Array(5)).map((_, i) => i);
  const teams = useSelector(GameSelector.teams);
  const gamePhase = useSelector(GameSelector.gamePhase);
  const proposalsRemaining = GameFunc.util.getProposalsRemaining(teams);
  const isHammer = proposalsRemaining === 0;
  const gameHammered = gamePhase === "finished" && isHammer;

  return (
    <div className={styles.MissionIndicators}>
      <span className={styles.title}>
        Mission
        <br />
        Progress
      </span>
      {missions.map((_, i) => (
        <MissionIndicator key={i} index={i} />
      ))}
      <div className={cn(styles.proposals, { [styles.hammer]: isHammer })}>
        <span className={styles.label1}>
          {gameHammered ? 0 : Math.min(5, proposalsRemaining + 1)}/5
        </span>
        <span className={styles.label2}>
          proposals
          <br />
          remaining
        </span>
      </div>
    </div>
  );
}

type MissionIndicatorProps = {
  index: number;
};

function MissionIndicator(props: MissionIndicatorProps) {
  const { index } = props;
  const teams = useSelector(GameSelector.teams);
  const numPlayers = useSelector(GameSelector.socketIDs).length;
  const lastTeam = useSelector(GameSelector.lastTeam);
  const mission = useSelector(GameSelector.missions);
  const curMission = mission[index] as MissionHistory | undefined;
  const lastTeamMission = lastTeam?.mission;
  const gamePhase = useSelector(GameSelector.gamePhase);

  const isCurrentMission = index + 1 === lastTeamMission;
  const isFinishedPhase = [
    "mission-review",
    "finished-assasinate",
    "finished",
  ].includes(gamePhase);
  const active = isCurrentMission && !isFinishedPhase;
  const missionResult =
    curMission && GameFunc.util.missionResult(curMission, numPlayers);
  const success =
    (!isCurrentMission || isFinishedPhase) && missionResult === "success";
  const fail =
    (!isCurrentMission || isFinishedPhase) && missionResult === "fail";

  const double = MissionNeedDouble[numPlayers][index];
  const playersRequired = MissionPlayerCount[numPlayers][index];
  const numFails =
    curMission?.actions.reduce((a, v) => (v === "fail" ? a + 1 : a), 0) ?? 0;

  let missionMembers: number[] = [];
  let missionLeader: number = -1;
  for (let i = teams.length - 1; i >= 0; i--) {
    if (teams[i].mission === index + 1) {
      missionMembers = teams[i].members;
      missionLeader = teams[i].leader;
      break;
    }
  }

  const popover = (
    <Tooltip id="mission-indicator-tooltip">
      <div className={styles.tooltip}>
        {fail ? (
          <>
            <span className={styles.title}>
              <TF>{`{{fail:Mission ${index + 1} Failed}}`}</TF>
            </span>
            <span>
              <TF>{plural(numFails, "fail") + " detected"}</TF>
            </span>
            <span>
              <TF>{`${missionMembers
                .map((x) => `{{name:${x}}}`)
                .join(", ")} by {{name:${missionLeader}}}`}</TF>
            </span>
          </>
        ) : success ? (
          <>
            <span className={styles.title}>
              <TF>{`{{success:Mission ${index + 1} Success}}`}</TF>
            </span>
            <span>
              <TF>{plural(numFails, "fail") + " detected"}</TF>
            </span>
            <span>
              <TF>{`${missionMembers
                .map((x) => `{{name:${x}}}`)
                .join(", ")} by {{name:${missionLeader}}}`}</TF>
            </span>
          </>
        ) : (
          <>
            <span className={styles.title}>
              <TF>{`Mission ${index + 1}`}</TF>
            </span>
            {active && (
              <span>
                {/* For N4 double only */}
                <TF>{`Current mission`}</TF>
              </span>
            )}
            {double && (
              <span>
                {/* For N4 double only */}
                <TF>{`2 fails required`}</TF>
              </span>
            )}
          </>
        )}
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      delay={400}
      placement="left"
      overlay={popover}
    >
      <div
        className={cn(styles.indicator, {
          [styles.fail]: fail,
          [styles.success]: success,
          [styles.active]: active,
          [styles.double]: double,
        })}
      >
        <span className={styles.label1}>{playersRequired}</span>
        <span className={styles.label2}>players</span>
      </div>
    </OverlayTrigger>
  );
}
