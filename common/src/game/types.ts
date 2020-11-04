export type GameInitOptions = {
  socketIDs: string[];
  names: string[];
  seed: number;
  gamemode: GameMode | GameCustomRoleOptions;
};
export type GameCustomRoleOptions = {
  captain: boolean;
  deputy: boolean;
  assasin: boolean;
  imposter: boolean;
  intern: boolean;
  mole: boolean;
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
  | "deputy"
  | "spy"
  | "assasin"
  | "imposter"
  | "mole"
  | "intern";
// --- Team Agent ---
// Agent knows noone
// Captain knows who spies are
// Deputy knows captain and impostor but doesn't know who's who
// --- Team Spies ---
// Spies know fellow spies (except intern)
// Assasin knows fellow spies (except intern), can kill one person at end of game
// Imposter knows fellow spies, appears as Captain to Deputy
// Mole is unknown to Captain
// Intern is unknown to other spies

export type GameState = {
  player: {
    names: string[];
    socketIDs: (string | null)[];
    roles: Role[];
  };
  assasinChoice: number | null;
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
