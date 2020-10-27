export type GameInitOptions = {
  gamemode: GameMode;
  socketIDs: string[];
  names: string[];
  seed: number;
};
export type Color =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

export type GameMode = "normal" | "assasins";
export type GamePhase =
  | "role-reveal"
  | "team-building"
  | "team-building-review"
  | "voting"
  | "voting-review"
  | "mission"
  | "mission-review"
  | "finished-assasinate"
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
export type MissionAction = "success" | "fail";
export type TeamHistory = {
  mission: number;
  leader: number;
  members: number[];
  votes: ProposalVote[];
};
export type MissionHistory = {
  mission: number;
  members: number[];
  actions: (MissionAction | null)[];
};
export type Team = "agent" | "spy";
export type Role =
  | "agent"
  | "captain"
  | "escort"
  | "spy"
  | "assasin"
  | "emissary"
  | "mole";

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
  teams: TeamHistory[];
  missions: MissionHistory[];
  chat: ChatMessage[];
  statusMessage: string | null;
};
