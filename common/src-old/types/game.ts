export type GameMode = "normal" | "mainframe";
export type GamePhase =
  | "role-reveal"
  | "team-building"
  | "team-building-review"
  | "voting"
  | "voting-review"
  | "mission"
  | "mission-review"
  | "finished-nuking"
  | "finished";

export type ChatMessage = PlayerChatMessage | SystemChatMessage;
export type PlayerChatMessage = {
  type: "player";
  player: number;
  content: string;
};
export type SystemChatMessage = {
  type: "system";
  content: string;
};

export type ProposalVote = "accept" | "reject" | "none";
export type MissionAction = "secure" | "hack";
export type TeamHistory = {
  leader: number;
  members: number[];
  votes: ProposalVote[];
};
export type MissionHistory = {
  actions: { [player: number]: MissionAction };
};
export type Team = "agent" | "hacker";
export type Role = "agent" | "admin" | "hacker" | "nuker" | "scripty";

export type GameState = {
  player: {
    names: string[];
    socketIDs: (string | null)[];
    roles: Role[];
  };
  winner: Team | null;
  game: {
    phase: GamePhase;
    mission: number;
    phaseCountdown: number;
  };
  team: TeamHistory[];
  mission: MissionHistory[];
  chat: ChatMessage[];
  statusMessage: string | null;
};
