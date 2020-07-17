import { GamePhase } from "./game";
export type Color =
  | "black"
  | "blue"
  | "cyan"
  | "green"
  | "indigo"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "teal"
  | "yellow";
  
export const ColorOrder: Color[] = [
  "black",
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
export const PLAYER_MIN = 5;
export const PLAYER_MAX = 10;
export const NUM_AGENTS_SPIES: { [i: number]: [number, number] } = {
  5: [3, 2],
  6: [4, 2],
  7: [4, 3],
  8: [5, 3],
  9: [6, 3],
  10: [6, 4],
};
export const MISSIONS: {
  [i: number]: [number, number, number, number, number];
} = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, -4, 4],
  8: [3, 4, 4, -5, 5],
  9: [3, 4, 4, -5, 5],
  10: [3, 4, 4, -5, 5],
};
export const PHASE_LENGTHS: { [p in GamePhase]: number } = {
  "role-reveal": 10,
  "team-building": 60 * 3,
  "team-building-review": 3,
  voting: 60 * 2,
  "voting-review": 5,
  mission: 60,
  "mission-review": 5,
  finished: 1,
};

export const GAME_PHASE_ORDER: GamePhase[] = [
  "role-reveal",
  "team-building",
  "team-building-review",
  "voting",
  "voting-review",
  "mission",
  "mission-review",
  "finished",
];
