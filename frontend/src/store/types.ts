import {
  GamePhase,
  Role,
  ProposalVote,
  TeamHistory,
  MissionHistory,
  ClientGameState,
  ClientAppState,
} from "common-types";

export const defaultAppState: ClientAppState = {
  roomIndex: -1,
  roomID: "",
  inGame: false,
  roomMembers: [],
  game: null,
};
