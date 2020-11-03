import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/game/CenterControls.module.scss";
import cn from "classnames";
import Button from "react-bootstrap/esm/Button";

export default function CenterControls() {
  return (
    <div className={styles.CenterControls}>
      {false && <MissionButtons />}
      {false && <VoteButtons />}
      {false && <ProposeButtons />}
      {false && <NukeButtons />}
      {true && <LeaveGameButtons />}
    </div>
  );
}

function MissionButtons() {
  const [failDisabled] = useState(false);
  const [successDown, setSuccessDown] = useState(false);
  const [failDown, setFailDown] = useState(false);
  const colorBackgroundRef = useRef(null as HTMLDivElement | null);

  const onMissionSelected = useCallback(() => {
    alert(successDown ? "Success" : "Fail");
  }, [successDown]);

  useEffect(() => {
    const handler = () => onMissionSelected();

    const div = colorBackgroundRef.current;
    if (!div) return;
    div.addEventListener("animationend", handler);
    return () => div.removeEventListener("animationend", handler);
  }, [onMissionSelected]);

  return (
    <div className={cn(styles.doubleButtonBox, styles.mission)}>
      <span className={styles.title}>Mission 1</span>
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
        onPointerDown={() => setFailDown(true)}
        onPointerUp={() => setFailDown(false)}
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
  return (
    <div className={cn(styles.doubleButtonBox, styles.vote)}>
      <span className={styles.title}>Mission 1 Proposal</span>
      <Button
        variant="success"
        role="button"
        className={cn(styles.voteButton, styles.accept)}
      >
        Accept
      </Button>
      <Button
        variant="danger"
        role="button"
        className={cn(styles.voteButton, styles.reject)}
      >
        Reject
      </Button>
      <div className={styles.background} />
    </div>
  );
}

function ProposeButtons() {
  const disabled = false;
  return (
    <div className={styles.centerButtonBox}>
      <Button disabled={disabled}>Propose</Button>
      <Button variant="outline-secondary" size="sm">
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
