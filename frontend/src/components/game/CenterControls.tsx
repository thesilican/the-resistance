import cn from "classnames";
import {
  GameAction,
  GameAgentRoles,
  LobbyAction,
  MissionPlayerCount,
} from "common-modules";
import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/game/CenterControls.module.scss";
import TF from "../common/TextTransformer";

export default function CenterControls() {
  const gamePhase = useSelector(GameSelector.gamePhase);
  const playerIndex = useSelector(GameSelector.playerIndex);
  const team = useSelector(GameSelector.team);
  const mission = useSelector(GameSelector.mission);
  const isAssassin = useSelector(GameSelector.playerRole) === "assassin";
  const isLeader = playerIndex === team?.leader;
  const voted = team?.votes[playerIndex] !== "none";
  const lastMissionPlayerIndex = mission?.members.indexOf(playerIndex) ?? 0;

  const proposeButtons = gamePhase === "team-building" && isLeader;
  const voteButtons = gamePhase === "voting" && !voted;
  const missionButtons =
    gamePhase === "mission" &&
    mission?.members.includes(playerIndex) &&
    mission?.actions[lastMissionPlayerIndex] === null;
  const assassinateButtons = isAssassin && gamePhase === "finished-assassinate";
  const leaveGameButtons = gamePhase === "finished";

  return (
    <div className={styles.CenterControls}>
      {proposeButtons && <ProposeButtons />}
      {voteButtons && <VoteButtons />}
      {missionButtons && <MissionButtons />}
      {assassinateButtons && <AssassinateButtons />}
      {leaveGameButtons && <LeaveGameButtons />}
    </div>
  );
}

function MissionButtons() {
  const dispatch = useDispatch();
  const role = useSelector(GameSelector.playerRole);
  const player = useSelector(GameSelector.playerIndex);
  const missionNum = useSelector(GameSelector.missionNum);
  const failDisabled = GameAgentRoles.includes(role);
  const [selected, setSelected] = useState(false);

  const onMissionSelected = (success: boolean) => {
    if (selected) return;
    setSelected(true);
    setTimeout(() => {
      dispatch(
        GameAction.sendMissionAction({
          player,
          action: success ? "success" : "fail",
        })
      );
    }, 1000);
  };

  return selected ? (
    <Fragment />
  ) : (
    <div className={styles.missionButtonBox}>
      <span className={styles.title}>Mission {missionNum}</span>
      <button
        className={cn(styles.missionButton, styles.success)}
        onClick={() => onMissionSelected(true)}
      >
        Success
      </button>
      <button
        className={cn(styles.missionButton, styles.fail, {
          [styles.disabled]: failDisabled,
        })}
        disabled={failDisabled}
        onClick={() => onMissionSelected(false)}
      >
        Fail
      </button>
      <div className={styles.background} />
    </div>
  );
}

function VoteButtons() {
  const dispatch = useDispatch();
  const player = useSelector(GameSelector.playerIndex);
  const handleAccept = () => {
    dispatch(
      GameAction.sendProposalVote({
        player,
        vote: "accept",
      })
    );
  };
  const handleReject = () => {
    dispatch(
      GameAction.sendProposalVote({
        player,
        vote: "reject",
      })
    );
  };

  return (
    <div className={styles.voteButtonBox}>
      <span className={styles.title}>Mission 1 Proposal</span>
      <Button
        variant="success"
        role="button"
        onClick={handleAccept}
        className={cn(styles.voteButton, styles.accept)}
      >
        Accept
      </Button>
      <Button
        variant="danger"
        role="button"
        onClick={handleReject}
        className={cn(styles.voteButton, styles.reject)}
      >
        Reject
      </Button>
    </div>
  );
}

function ProposeButtons() {
  const dispatch = useDispatch();
  const numPlayers = useSelector(GameSelector.numPlayers);
  const team = useSelector(GameSelector.team);
  const curTeamRequiredPlayers =
    MissionPlayerCount[numPlayers][(team?.mission ?? 1) - 1];
  const enabled = team?.members?.length === curTeamRequiredPlayers;

  const handlePropose = () => {
    if (enabled) {
      dispatch(GameAction.finishTeamBuilding());
    }
  };

  const handlePass = () => {
    dispatch(GameAction.passTeamBuilding());
  };

  return (
    <div className={styles.centerButtonBox}>
      <Button disabled={!enabled} onClick={handlePropose}>
        Propose
      </Button>
      <Button variant="outline-secondary" size="sm" onClick={handlePass}>
        Pass
      </Button>
    </div>
  );
}

function AssassinateButtons() {
  const dispatch = useDispatch();
  const isAssassin = useSelector(GameSelector.playerRole) === "assassin";
  const assassinChoice = useSelector(GameSelector.assassinChoice);
  const enabled = isAssassin && assassinChoice !== null;

  const handleClick = () => {
    if (assassinChoice !== null) {
      dispatch(GameAction.finishAssassinChoice());
    }
  };
  return (
    <div className={styles.centerButtonBox}>
      <Button onClick={handleClick} disabled={!enabled}>
        Assassinate
      </Button>
    </div>
  );
}

function LeaveGameButtons() {
  const dispatch = useDispatch();
  const winner = useSelector(GameSelector.winner);
  const handleClick = () => {
    dispatch(LobbyAction.clientLeaveGame());
  };
  return (
    <div className={styles.centerButtonBox}>
      {winner && (
        <h3 className={"font-weight-bold"}>
          <TF>
            {winner === "agent"
              ? "{{success: Agents Win!}}"
              : "{{fail: Spies Win!}}"}
          </TF>
        </h3>
      )}
      <Button onClick={handleClick} variant="primary">
        Return to Lobby
      </Button>
    </div>
  );
}
