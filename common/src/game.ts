export type GamePhase =
  | "role-reveal"
  | "team-building"
  | "team-building-review"
  | "voting"
  | "voting-review"
  | "mission"
  | "mission-review"
  | "finished";
export type Role = "agent" | "spy";
export type ProposalVote = "accept" | "reject" | "none";
export type MissionAction = "succeed" | "fail";
export type TeamHistory = {
  missionNum: number;
  leader: number;
  members: number[];
  votes: ProposalVote[];
};

export type MissionPlayerActions = { [player: number]: MissionAction };
export type MissionHistory = {
  actions: MissionPlayerActions | "hammer";
  success: boolean;
};

export type ChatMessage = SystemChatMessage | PlayerChatMessage;
export type PlayerChatMessage = {
  type: "player";
  player: number;
  content: string;
};
export type SystemChatMessage = {
  type: "system";
  content: string;
};

export type ServerGameState = {
  players: string[];
  roles: Role[];
  winners?: Role;
  playerDisconnected: boolean[];

  gamePhase: GamePhase;
  gamePhaseCountdown: number;
  missionNumber: number;

  teamLeader: number;
  teamMembers: number[];
  teamProposalVote: ProposalVote[];

  missionActions: { [id: number]: MissionAction | null };

  teamHistory: TeamHistory[];
  missionHistory: MissionHistory[];
  chatHistory: ChatMessage[];
  statusMessage: string;
};

export type ClientAppState = {
  roomID: string;
  roomMembers: string[];
  roomIndex: number;
  inGame: boolean;
  game: ClientGameState | null;
};

export type ClientGameState = {
  players: string[];
  playerIndex: number;
  role: Role;
  spies?: number[];
  winners?: Role;
  playerDisconnected: boolean[];

  gamePhase: GamePhase;
  gamePhaseCountdown: number;
  missionNumber: number;

  teamLeader: number;
  teamMembers: number[];
  teamProposalVote: ProposalVote | null;
  missionAction: MissionAction | null;

  teamHistory: TeamHistory[];
  missionHistory: MissionHistory[];
  chatHistory: ChatMessage[];
  statusMessage: string;
};
