import { Color, GameMode, GamePhase, Role } from "./types";

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

export const GamePhaseLengths: { [p in GamePhase]: number } = {
  "role-reveal": 10,
  "team-building": 60 * 3,
  "team-building-review": 3,
  voting: 60,
  "voting-review": 5,
  mission: 20,
  "mission-review": 5,
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

export const GameRolePools: {
  [m in GameMode]: { [i: number]: { [r in Role]: number } };
} = {
  normal: {
    5: {
      agent: 3,
      captain: 0,
      escort: 0,
      spy: 2,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    6: {
      agent: 4,
      captain: 0,
      escort: 0,
      spy: 2,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    7: {
      agent: 4,
      captain: 0,
      escort: 0,
      spy: 3,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    8: {
      agent: 5,
      captain: 0,
      escort: 0,
      spy: 3,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    9: {
      agent: 5,
      captain: 0,
      escort: 0,
      spy: 4,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    10: {
      agent: 6,
      captain: 0,
      escort: 0,
      spy: 4,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
  },
  assasins: {
    5: {
      agent: 5,
      captain: 0,
      escort: 0,
      spy: 0,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    6: {
      agent: 6,
      captain: 0,
      escort: 0,
      spy: 0,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    7: {
      agent: 7,
      captain: 0,
      escort: 0,
      spy: 0,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    8: {
      agent: 8,
      captain: 0,
      escort: 0,
      spy: 0,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    9: {
      agent: 9,
      captain: 0,
      escort: 0,
      spy: 0,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
    10: {
      agent: 10,
      captain: 0,
      escort: 0,
      spy: 0,
      assasin: 0,
      emissary: 0,
      mole: 0,
    },
  },
};

export const GameMinPlayers = 5;
export const GameMaxPlayers = 10;
