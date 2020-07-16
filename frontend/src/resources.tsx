import spritesheet from "../assets/spritesheet.png";
import ynr from "../assets/stickman-yellow-nohat-right.png";
import Util from "./util";

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

export const ColorValues = {
  black: "#000000",
  red: "#ff0000",
  orange: "#e18700",
  yellow: "#b0b000",
  green: "#3cff00",
  teal: "#00ff67",
  cyan: "#00b4b4",
  blue: "#0067ff",
  indigo: "#3c00ff",
  purple: "#a000c8",
  pink: "#e10087",
};

export const newColorValues: string[] = ColorOrder.map((c) => ColorValues[c]);

export const spriteCoords = {
  stickman: {
    black: { left: [0, 0], right: [1, 0] },
    blue: { left: [2, 0], right: [3, 0] },
    cyan: { left: [4, 0], right: [5, 0] },
    green: { left: [0, 1], right: [1, 1] },
    indigo: { left: [2, 1], right: [3, 1] },
    orange: { left: [4, 1], right: [5, 1] },
    pink: { left: [0, 2], right: [1, 2] },
    purple: { left: [2, 2], right: [3, 2] },
    red: { left: [4, 2], right: [5, 2] },
    teal: { left: [0, 3], right: [1, 3] },
    yellow: { left: [2, 3], right: [3, 3] },
  },
  hat: {
    left: [5, 3],
    right: [6, 0],
  },
  agent: [4, 3],
  spy: [6, 1],
  vote: {
    accept: [6, 2],
    reject: [6, 3],
  },
};
