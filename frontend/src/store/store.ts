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
      socketID: "abcd",
    },
    lobby: {
      id: "ABCD",
      memberIDs: ["abcd", "efgh", "ijkl", "mnop", "qrst"],
      names: ["Alice", "Bob", "Charlie", "David", "Emily"],
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
        names: ["Alice", "Bob", "Charlie", "David", "Emily"],
        socketIDs: ["abcd", "efgh", null, null, "qrst"],
        roles: ["agent", "agent", "agent", "spy", "spy"],
      },
      assassinChoice: null,
      winner: null,
      game: {
        phase: "role-reveal",
        mission: 1,
        phaseCountdown: 5,
      },
      team: null,
      teamHistory: [],
      mission: null,
      missionHistory: [],
      chat: [{ content: "hi", type: "system" }],
      statusMessage: "Hello, world!",
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
