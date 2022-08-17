import { AnyAction, configureStore, Middleware } from "@reduxjs/toolkit";
import {
  GameReducer,
  GameState,
  LobbyReducer,
  LobbyState,
} from "common-modules";
import io from "socket.io-client";
import { ClientAction, ClientReducer, ClientState } from "./client";

const production = process.env.NODE_ENV === "production";
const socketIOMiddleware: Middleware = (store) => (next) => {
  const socket = io({ reconnection: false });
  socket.on("connect", () => {
    if (!production) console.log("Connection", socket.id);
    store.dispatch(ClientAction.setSocketID(socket.id));
  });
  socket.on("disconnect", () => {
    alert("You have been disconnected from the server");
    window.location.reload();
  });
  socket.on("action", (action: AnyAction) => {
    store.dispatch(action);
  });
  return (action: AnyAction) => {
    const type = action.type as string;

    if (action?.meta?.server) {
      if (action?.error) {
        alert(action.error);
        return action;
      } else {
        return next(action);
      }
    } else if (type.startsWith("lobby/") || type.startsWith("game/")) {
      socket.emit("action", action);
      return action;
    } else {
      return next(action);
    }
  };
};

// For development purposes
const SHOULD_MOCK_STATE = true;
const MOCK_STATE: { lobby: LobbyState; game: GameState; client: ClientState } =
  {
    client: {
      socketID: "mno",
    },
    lobby: {
      id: "ABCD",
      memberIDs: ["abc", "def", "ghi", "jkl", "mno", "pqr", "stu"],
      names: ["Alice", "Bob", "Charlie", "David", "Emily", "Fred", "Ginny"],
      gameInitOptions: {
        assassin: true,
        captain: false,
        deputy: true,
        imposter: false,
        intern: false,
        mole: true,
      },
      inGame: true,
    },
    game: {
      player: {
        names: ["Alice", "Bob", "Charlie", "David", "Emily", "Fred", "Ginny"],
        socketIDs: ["abc", "def", "ghi", "jkl", "mno", "pqr", "stu"],
        roles: [
          "captain",
          "deputy",
          "agent",
          "agent",
          "assassin",
          "imposter",
          "spy",
        ],
      },
      assassinChoice: 0,
      winner: null,
      game: {
        phase: "team-building",
        mission: 3,
        phaseCountdown: 5,
      },
      team: {
        leader: 0,
        members: [0, 1],
        mission: 3,
        votes: ["none", "none", "none", "none", "none", "none", "none"],
      },
      teamHistory: [
        {
          leader: 0,
          members: [0, 1],
          mission: 1,
          votes: [
            "accept",
            "accept",
            "accept",
            "accept",
            "accept",
            "accept",
            "accept",
          ],
        },
        {
          leader: 1,
          members: [0, 1, 2],
          mission: 2,
          votes: [
            "accept",
            "accept",
            "accept",
            "accept",
            "accept",
            "accept",
            "accept",
          ],
        },
        {
          leader: 0,
          members: [0, 1, 2],
          mission: 3,
          votes: [
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
          ],
        },
        {
          leader: 0,
          members: [0, 1, 2],
          mission: 3,
          votes: [
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
          ],
        },
        {
          leader: 0,
          members: [0, 1, 2],
          mission: 3,
          votes: [
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
          ],
        },
        {
          leader: 0,
          members: [0, 1, 2],
          mission: 3,
          votes: [
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
            "reject",
          ],
        },
      ],
      mission: null,
      missionHistory: [
        {
          actions: ["success", "success"],
          members: [0, 1],
          mission: 1,
        },
        {
          actions: ["success", "fail", "fail"],
          members: [0, 1, 2],
          mission: 2,
        },
      ],
      chat: [
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { type: "player", content: "hi", player: 1 },
        { content: "{{name:1}} is {{success:good}}", type: "system" },
        { type: "player", content: "wut", player: 2 },
      ],
      statusMessage: "Guys, {{name:1}} is {{role:captain}}",
    },
  };
const ignoreActionMiddleware: Middleware = (_) => (_) => (_) => {};

export const store = configureStore({
  reducer: {
    lobby: LobbyReducer,
    game: GameReducer,
    client: ClientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    SHOULD_MOCK_STATE
      ? getDefaultMiddleware().concat(ignoreActionMiddleware)
      : getDefaultMiddleware().concat(socketIOMiddleware),
  preloadedState: SHOULD_MOCK_STATE ? MOCK_STATE : undefined,
});

export type RootState = ReturnType<typeof store.getState>;
