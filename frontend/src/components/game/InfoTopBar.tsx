import { PHASE_LENGTHS } from "common-types";
import React from "react";
import { ProgressBar } from "react-bootstrap";
import { useStore } from "../../store";

type InfoTopBarProps = {};

const phases = {
  "role-reveal": "Role Reveal",
  "team-building": "Team Building",
  "team-building-review": "Team Building Review",
  voting: "Voting",
  "voting-review": "Voting Review",
  mission: "Mission",
  "mission-review": "Mission Review",
  finished: "Game Finished",
};

export default function InfoTopBar({}: InfoTopBarProps) {
  const [state] = useStore();
  if (!state.game) return null;
  const phase = phases[state.game.gamePhase];
  const sentence =
    state.game.gamePhase === "role-reveal" ||
    state.game.gamePhase === "finished"
      ? phase
      : "Mission " + state.game.missionNumber + " - " + phase;
  const progress =
    (state.game.gamePhaseCountdown * 100) / PHASE_LENGTHS[state.game.gamePhase];
  return (
    <div className="InfoTopBar">
      <h3>{sentence}</h3>
      <ProgressBar now={progress}></ProgressBar>
    </div>
  );
}
