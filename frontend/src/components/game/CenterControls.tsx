import cn from "classnames";
import { GameAction, GameAgentRoles, MissionPlayerCount } from "common-modules";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/game/CenterControls.module.scss";

export default function CenterControls() {
  const gamePhase = useSelector(GameSelector.gamePhase);
  const playerIndex = useSelector(GameSelector.playerIndex);
  const lastTeam = useSelector(GameSelector.lastTeam);
  const lastMission = useSelector(GameSelector.lastMission);
  const isLeader = playerIndex === lastTeam?.leader;
  const voted = lastTeam?.votes[playerIndex] !== "none";
  const lastMissionPlayerIndex = lastMission?.members.indexOf(playerIndex) ?? 0;

  const proposeButtons = gamePhase === "team-building" && isLeader;
  const voteButtons = gamePhase === "voting" && !voted;
  const missionButtons =
    gamePhase === "mission" &&
    lastMission?.members.includes(playerIndex) &&
    lastMission?.actions[lastMissionPlayerIndex] === null;
  return (
    <div className={styles.CenterControls}>
      {proposeButtons && <ProposeButtons />}
      {voteButtons && <VoteButtons />}
      {missionButtons && <MissionButtons />}
      {false && <NukeButtons />}
      {false && <LeaveGameButtons />}
    </div>
  );
}

function MissionButtons() {
  const dispatch = useDispatch();
  const role = useSelector(GameSelector.playerRole);
  const player = useSelector(GameSelector.playerIndex);
  const missionNum = useSelector(GameSelector.missionNum);
  const failDisabled = GameAgentRoles.includes(role);
  const [successDown, setSuccessDown] = useState(false);
  const [failDown, setFailDown] = useState(false);
  const colorBackgroundRef = useRef(null as HTMLDivElement | null);

  const onMissionSelected = useCallback(() => {
    dispatch(
      GameAction.sendMissionAction({
        player,
        action: successDown ? "success" : "fail",
      })
    );
  }, [dispatch, player, successDown]);

  useEffect(() => {
    const handler = () => onMissionSelected();

    const div = colorBackgroundRef.current;
    if (!div) return;
    div.addEventListener("animationend", handler);
    return () => div.removeEventListener("animationend", handler);
  }, [onMissionSelected]);

  return (
    <div className={cn(styles.doubleButtonBox, styles.mission)}>
      <span className={styles.title}>Mission {missionNum}</span>
      <button
        className={cn(styles.missionButton, styles.success)}
        onPointerDown={() => setSuccessDown(true)}
        onPointerUp={() => setSuccessDown(false)}
      >
        Success
      </button>
      <button
        className={cn(styles.missionButton, styles.fail, {
          [styles.disabled]: failDisabled,
        })}
        onPointerDown={() => !failDisabled && setFailDown(true)}
        onPointerUp={() => !failDisabled && setFailDown(false)}
      >
        Fail
      </button>
      <div className={styles.background} />
      <div
        ref={colorBackgroundRef}
        className={cn(styles.missionColorBackground, {
          [styles.fail]: failDown,
          [styles.success]: successDown,
        })}
      />
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
    <div className={cn(styles.doubleButtonBox, styles.vote)}>
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
      <div className={styles.background} />
    </div>
  );
}

function ProposeButtons() {
  const dispatch = useDispatch();
  // TODO: Refactor maybe
  const numPlayers = useSelector(GameSelector.numPlayers);
  const lastTeam = useSelector(GameSelector.lastTeam);
  const curTeamRequiredPlayers =
    MissionPlayerCount[numPlayers][(lastTeam?.mission ?? 1) - 1];
  const enabled = lastTeam?.members?.length === curTeamRequiredPlayers;

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

function NukeButtons() {
  const disabled = true;
  return (
    <div className={styles.centerButtonBox}>
      <Button disabled={disabled}>Nuke</Button>
    </div>
  );
}

function LeaveGameButtons() {
  return (
    <div className={styles.centerButtonBox}>
      <Button variant="outline-secondary">Return to Lobby</Button>
    </div>
  );
}
