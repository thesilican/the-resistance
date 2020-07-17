import {
  ClientGameState,
  ChatMessage,
  GamePhase,
  TeamHistory,
  Role,
  MissionAction,
  ProposalVote,
  MissionHistory,
} from "./game";

export type Action = ClientAction | LobbyAction | ErrorAction | GameAction;

export type ClientAction = ChangeURLIDAction;
export type ChangeURLIDAction = {
  category: "client";
  type: "change-url-id";
  urlRoomID: string;
};

// Lobby Action
export type LobbyAction =
  | JoinLobbyAction
  | LeaveLobbyAction
  | PlayerJoinedLobbyAction
  | PlayerLeftLobbyAction;
export type JoinLobbyAction = {
  category: "lobby";
  type: "join-lobby";
  roomIndex: number;
  roomID: string;
  roomMembers: string[];
  game: ClientGameState | null;
};
export type LeaveLobbyAction = {
  category: "lobby";
  type: "leave-lobby";
};
export type PlayerJoinedLobbyAction = {
  category: "lobby";
  type: "player-join";
  name: string;
};
export type PlayerLeftLobbyAction = {
  category: "lobby";
  type: "player-leave";
  index: number;
};

// Error Action
export type ErrorAction = ErrorInvalidLobbyIDAction;
export type ErrorInvalidLobbyIDAction = {
  category: "error";
  type: "invalid-lobby-id";
};

// Game Action
export type GameAction =
  | GameBasicAction
  | GameTeamBuildingAction
  | GameVotingAction
  | GameMissionAction
  | GameFinishAction
  | GameChatAction;
export type GameBasicAction =
  | UpdateGameStateAction
  | JoinGameAction
  | LeaveGameAction
  | PlayerRejoinGameAction
  | PlayerLeaveGameAction
  | UpdateGamePhaseAction;
export type UpdateGameStateAction = {
  category: "game";
  type: "update-game-state";
  state: ClientGameState | null;
};
export type JoinGameAction = {
  category: "game";
  type: "join-game";
  state: ClientGameState;
};
export type LeaveGameAction = {
  category: "game";
  type: "leave-game";
};
export type PlayerLeaveGameAction = {
  category: "game";
  type: "player-leave-game";
  index: number;
};
export type PlayerRejoinGameAction = {
  category: "game";
  type: "player-rejoin-game";
  index: number;
};
export type UpdateGamePhaseAction = {
  category: "game";
  type: "update-game-phase";
  countdown: number;
  gamePhase?: GamePhase;
  missionNum?: number;
};

// Team Building
export type GameTeamBuildingAction =
  | NewTeamBuildingAction
  | UpdateTeamMembersAction;
export type NewTeamBuildingAction = {
  category: "game";
  type: "new-team-building";
  leader: number;
};
export type UpdateTeamMembersAction = {
  category: "game";
  type: "update-team-members";
  members: number[];
};

// Voting
export type GameVotingAction =
  | NewVotingPhaseAction
  | SetVoteAction
  | UpdateTeamHistoryAction;
export type NewVotingPhaseAction = {
  category: "game";
  type: "new-voting-phase";
};
export type SetVoteAction = {
  category: "game";
  type: "set-vote";
  vote: ProposalVote;
};
export type UpdateTeamHistoryAction = {
  category: "game";
  type: "update-team-history";
  newHistory: TeamHistory;
};

// Mission
export type GameMissionAction =
  | NewMissionAction
  | SetMissionActionAction
  | UpdateMissionHistoryAction;
export type NewMissionAction = {
  category: "game";
  type: "new-mission-action";
};
export type SetMissionActionAction = {
  category: "game";
  type: "set-mission-action";
  missionAction: MissionAction;
};
export type UpdateMissionHistoryAction = {
  category: "game";
  type: "update-mission-history";
  newMission?: MissionHistory;
  updateMission?: MissionHistory;
};

// Finish
export type GameFinishAction = FinishGameAction;
export type FinishGameAction = {
  category: "game";
  type: "finish-game";
  winners: Role;
  spies: number[];
};

// Chat
export type GameChatAction = NewChatMessageAction | UpdateGameStatusAction;
export type NewChatMessageAction = {
  category: "game";
  type: "new-chat-message";
  chatMessage: ChatMessage;
};
export type UpdateGameStatusAction = {
  category: "game";
  type: "update-status-message";
  message: string;
};
