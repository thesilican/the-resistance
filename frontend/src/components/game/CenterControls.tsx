import React from "react";
import { Button } from "react-bootstrap";
import { useStore } from "../../store";
import { useSocket } from "../../socket";
import { MISSIONS } from "common-types";
import { ColorOrder } from "../../resources";
import NameTransformer from "./NameTransformer";

type CenterControlsProps = {};

export default function CenterControls({}: CenterControlsProps) {
  const [state] = useStore();
  const socket = useSocket();
  if (!state.game) return null;
  const showTeamBuildingButton =
    state.game.gamePhase === "team-building" &&
    state.game.teamLeader === state.game.playerIndex;
  const doneSelectingTeamEnabled =
    Math.abs(
      MISSIONS[state.game.players.length][state.game.missionNumber - 1]
    ) === state.game.teamMembers.length;
  const showVotingButton =
    state.game.gamePhase === "voting" && state.game.teamProposalVote === null;
  const showMissionButton =
    state.game.gamePhase === "mission" &&
    state.game.teamMembers.includes(state.game.playerIndex) &&
    state.game.missionAction === null;
  const isSpy = state.game.role === "spy";
  const handleDoneTeamBuilding = () => {
    socket.emit("message", {
      category: "game",
      type: "done-team-proposal",
    });
  };
  const handleVoting = (approve: boolean) => {
    socket.emit("message", {
      category: "game",
      type: "send-vote",
      vote: approve ? "accept" : "reject",
    });
  };
  const handleMission = (succeed: boolean) => {
    socket.emit("message", {
      category: "game",
      type: "send-mission-action",
      action: succeed ? "succeed" : "fail",
    });
  };

  return (
    <div className="CenterControls">
      {showTeamBuildingButton && (
        <div className="team-building">
          <Button
            disabled={!doneSelectingTeamEnabled}
            onClick={handleDoneTeamBuilding}
          >
            Done
          </Button>
        </div>
      )}
      {showVotingButton && (
        <div className="voting">
          <span className="description">
            <NameTransformer names={state.game.players} colors={ColorOrder}>
              {`Do you approve [[${state.game!.teamLeader}]]'s team?`}
            </NameTransformer>
          </span>
          <div>
            <Button className="mr-3 success" onClick={() => handleVoting(true)}>
              Approve
            </Button>
            <Button className="fail" onClick={() => handleVoting(false)}>
              Reject
            </Button>
          </div>
        </div>
      )}
      {showMissionButton && (
        <div className="mission">
          <span className="description">
            Mission #{state.game.missionNumber}
          </span>
          <div>
            <Button
              className="mr-3 success"
              onClick={() => handleMission(true)}
            >
              Succeed
            </Button>
            <Button
              className="fail"
              disabled={!isSpy}
              onClick={() => handleMission(false)}
            >
              Fail
            </Button>
          </div>
          {!isSpy && (
            <span className="details">Agents cannot fail a mission</span>
          )}
        </div>
      )}
    </div>
  );
}
