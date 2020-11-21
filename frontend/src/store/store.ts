import { AnyAction, configureStore, Middleware } from "@reduxjs/toolkit";
import { GameReducer, LobbyReducer } from "common-modules";
import io from "socket.io-client";
import { ClientAction, ClientReducer } from "./client";

const production = process.env.NODE_ENV === "production";
const socketIOMiddleware: Middleware = ({ dispatch }) => (next) => {
  const socket = io(production ? "" : ":8080", {
    reconnection: false,
  });
  socket.on("connect", () => {
    console.log("Connection", socket.id);
    dispatch(ClientAction.setSocketID(socket.id));
  });
  socket.on("disconnect", () => {
    alert("You have been disconnected from the server");
    window.location.reload();
  });
  socket.on("action", (action: AnyAction) => {
    dispatch(action);
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

export const store = configureStore({
  reducer: {
    lobby: LobbyReducer,
    game: GameReducer,
    client: ClientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketIOMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
