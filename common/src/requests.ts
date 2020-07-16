import { ProposalVote, PlayerChatMessage, MissionAction } from "./game";

export type Request = ServerRequest | LobbyRequest | GameRequest;

// Server Request
export type ServerRequest = CreateRoomRequest | JoinRoomRequest;

export type CreateRoomRequest = {
  category: "server";
  type: "create-room";
  name: string;
};
export type JoinRoomRequest = {
  category: "server";
  type: "join-room";
  name: string;
  roomID: string;
};

// Lobby Request
export type LobbyRequest = StartGameRequest | LeaveGameRequest | RejoinGameRequest;
export type StartGameRequest = {
  category: "lobby";
  type: "start-game";
};
export type LeaveGameRequest = {
  category: "lobby";
  type: "leave-game";
};
export type RejoinGameRequest = {
  category: "lobby";
  type: "rejoin-game";
  index: number;
};

// Game Request
export type GameRequest =
  | GameTeamBuildingRequest
  | GameVotingRequest
  | GameMissionRequest
  | GameChatRequest;

// Team Building phase
export type GameTeamBuildingRequest =
  | UpdateTeamProposalRequest
  | DoneTeamProposalRequest
  | SkipTeamProposalRequest;
export type UpdateTeamProposalRequest = {
  category: "game";
  type: "update-team-proposal";
  teamMembers: number[];
};
export type DoneTeamProposalRequest = {
  category: "game";
  type: "done-team-proposal";
};
export type SkipTeamProposalRequest = {
  category: "game";
  type: "skip-team-proposal";
};

// Voting
export type GameVotingRequest = SendVoteRequest;
export type SendVoteRequest = {
  category: "game";
  type: "send-vote";
  vote: ProposalVote;
};

// Mission
export type GameMissionRequest = SendMissionActionRequest;
export type SendMissionActionRequest = {
  category: "game";
  type: "send-mission-action";
  action: MissionAction;
};

// Chat
export type GameChatRequest = SendChatMessageRequest;
export type SendChatMessageRequest = {
  category: "game";
  type: "send-chat-message";
  content: string;
};
