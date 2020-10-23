import { GameMode, GamePhase, Role } from "./game";

export const GamePhaseLengths: { [p in GamePhase]: number } = {
  "role-reveal": 10,
  "team-building": 60 * 3,
  "team-building-review": 3,
  voting: 60,
  "voting-review": 5,
  mission: 20,
  "mission-review": 5,
  "finished-nuking": 60,
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

export const MissionRolePools: {
  [m in GameMode]: { [i: number]: { [r in Role]: number } };
} = {
  normal: {
    5: { admin: 0, agent: 3, hacker: 2, nuker: 0, scripty: 0 },
    6: { admin: 0, agent: 4, hacker: 2, nuker: 0, scripty: 0 },
    7: { admin: 0, agent: 4, hacker: 3, nuker: 0, scripty: 0 },
    8: { admin: 0, agent: 5, hacker: 3, nuker: 0, scripty: 0 },
    9: { admin: 0, agent: 5, hacker: 4, nuker: 0, scripty: 0 },
    10: { admin: 0, agent: 6, hacker: 4, nuker: 0, scripty: 0 },
  },
  mainframe: {
    5: { admin: 0, agent: 5, hacker: 0, nuker: 0, scripty: 0 },
    6: { admin: 0, agent: 6, hacker: 0, nuker: 0, scripty: 0 },
    7: { admin: 0, agent: 7, hacker: 0, nuker: 0, scripty: 0 },
    8: { admin: 0, agent: 8, hacker: 0, nuker: 0, scripty: 0 },
    9: { admin: 0, agent: 9, hacker: 0, nuker: 0, scripty: 0 },
    10: { admin: 0, agent: 10, hacker: 0, nuker: 0, scripty: 0 },
  },
};
