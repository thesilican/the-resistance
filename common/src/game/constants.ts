import { Color, GameMode, GamePhase, Role } from "./types";

export const ColorOrder: Color[] = [
  "red",
  "yellow",
  "blue",
  "orange",
  "green",
  "purple",
  "pink",
  "cyan",
  "teal",
  "indigo",
];

export const GamePhaseLengths: { [p in GamePhase]: number } = {
  // TODO: return to 10
  "role-reveal": 5,
  // TODO: return to 180
  "team-building": 30,
  // TODO: return to 3
  "team-building-review": 2,
  // return to 60
  voting: 30,
  // return to 5
  "voting-review": 2,
  mission: 20,
  // return to 5
  "mission-review": 2,
  "finished-assasinate": 60,
  finished: 1,
};

export const MissionPlayerCount: {
  [i: number]: [number, number, number, number, number];
} = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};

export const MissionNeedDouble: {
  [i: number]: [boolean, boolean, boolean, boolean, boolean];
} = {
  5: [false, false, false, false, false],
  6: [false, false, false, false, false],
  7: [false, false, false, true, false],
  8: [false, false, false, true, false],
  9: [false, false, false, true, false],
  10: [false, false, false, true, false],
};

export const TeamPoolsNormal: { [n: number]: Role[] } = {
  5: ["agent", "agent", "agent", "spy", "spy"],
  6: ["agent", "agent", "agent", "agent", "spy", "spy"],
  7: ["agent", "agent", "agent", "agent", "spy", "spy", "spy"],
  8: ["agent", "agent", "agent", "agent", "agent", "spy", "spy", "spy"],
  9: [
    "agent",
    "agent",
    "agent",
    "agent",
    "agent",
    "agent",
    "spy",
    "spy",
    "spy",
  ],
  10: [
    "agent",
    "agent",
    "agent",
    "agent",
    "agent",
    "agent",
    "spy",
    "spy",
    "spy",
    "spy",
  ],
};

export const TeamPoolsAssasins: { [n: number]: Role[] } = {
  5: ["agent", "agent", "captain", "spy", "assasin"],
  6: ["agent", "agent", "agent", "captain", "spy", "assasin"],
  7: ["agent", "agent", "agent", "captain", "spy", "intern", "assasin"],
  8: [
    "agent",
    "agent",
    "agent",
    "agent",
    "captain",
    "spy",
    "assasin",
    "intern",
  ],
  9: [
    "agent",
    "agent",
    "agent",
    "agent",
    "agent",
    "captain",
    "spy",
    "assasin",
    "intern",
  ],
  10: [
    "agent",
    "agent",
    "agent",
    "agent",
    "agent",
    "captain",
    "spy",
    "spy",
    "assasin",
    "intern",
  ],
};

export const GameMinPlayers = 5;
export const GameMaxPlayers = 10;

export const GameRolesOrder: Role[] = [
  "agent",
  "captain",
  "deputy",
  "spy",
  "assasin",
  "intern",
  "imposter",
  "mole",
];
export const GameAgentRoles: Role[] = ["agent", "captain", "deputy"];
