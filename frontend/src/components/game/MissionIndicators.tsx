import cn from "classnames";
import {
  count,
  GameFunc,
  Mission,
  MissionNeedDouble,
  MissionPlayerCount,
  range,
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
  const missionNum = useSelector(GameSelector.missionNum);
  const teamHistory = useSelector(GameSelector.teamHistory);
  const proposalsRemaining = GameFunc.util.getProposalsRemaining(
    teamHistory,
    missionNum
  );
  const isHammer = proposalsRemaining === 1;

  return (
    <div className={styles.MissionIndicators}>
      <span className={styles.title}>
        Mission
        <br />
        Progress
      </span>
      {range(5).map((_, i) => (
        <MissionIndicator key={i} index={i} />
      ))}
      <div className={cn(styles.proposals, { [styles.hammer]: isHammer })}>
        <span className={styles.label1}>{proposalsRemaining}/5</span>
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
  // const teams = useSelector(GameSelector.teams);
  // const numPlayers = useSelector(GameSelector.socketIDs).length;
  // const lastTeam = useSelector(GameSelector.lastTeam);
  // const mission = useSelector(GameSelector.missions);
  // const curMission = mission[index] as MissionHistory | undefined;
  // const lastTeamMission = lastTeam?.mission;
  // const gamePhase = useSelector(GameSelector.gamePhase);
  const teamHistory = useSelector(GameSelector.teamHistory);
  const numPlayers = useSelector(GameSelector.numPlayers);
  const missionHistory = useSelector(GameSelector.missionHistory);
  const missionNum = useSelector(GameSelector.missionNum);
  const mission = missionHistory[index] as Mission | undefined;

  const missionResult =
    mission && GameFunc.util.getMissionResult(mission, numPlayers);
  const active = missionNum === index + 1 && !missionResult;
  const success = missionResult === "success";
  const fail = missionResult === "fail";
  const double = MissionNeedDouble[numPlayers][index];

  const playersRequired = MissionPlayerCount[numPlayers][index];
  const numFails = mission && count(mission.actions, "fail");

  let teamLeader: number = -1;
  let teamMembers: number[] = [];
  for (let i = teamHistory.length - 1; i >= 0; i--) {
    if (teamHistory[i].mission === index + 1) {
      teamMembers = teamHistory[i].members;
      teamLeader = teamHistory[i].leader;
      break;
    }
  }

  const popover = (
    <Tooltip id="mission-indicator-tooltip">
      <div className={styles.tooltip}>
        {fail || success ? (
          <>
            <span className={styles.title}>
              <TF>{`{{${fail ? "fail" : "success"}:Mission ${index + 1} ${
                fail ? "Failed" : "Success"
              }}}`}</TF>
            </span>
            <span>
              <TF>{plural(numFails ?? 0, "fail") + " detected"}</TF>
            </span>
            <span>
              <TF>{`${teamMembers
                .map((x) => `{{name:${x}}}`)
                .join(", ")} by {{name:${teamLeader}}}`}</TF>
            </span>
          </>
        ) : (
          <>
            <span className={styles.title}>
              <TF>{`Mission ${index + 1}`}</TF>
            </span>
            {active && (
              <span>
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
