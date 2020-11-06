import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import {
  GameAction,
  GameInitOptions,
  GameMaxPlayers,
  GameMinPlayers,
  GameReducer,
  GameState,
  LobbyAction,
  LobbyReducer,
  LobbyState,
} from "common-modules";
import { Server, Socket } from "socket.io";
import { actionFromServer } from "./util";

type LobbyStore = EnhancedStore<LobbyState, AnyAction>;

export class Lobby {
  store: LobbyStore;
  game: Game | null;
  get id() {
    return this.store.getState().id;
  }

  constructor(id: string) {
    this.store = configureStore({
      reducer: LobbyReducer,
    });
    this.store.dispatch(LobbyAction.initialize({ id }));
    this.game = null;
  }
  onJoin(name: string, socket: Socket, io: Server) {
    const memberJoinAction = LobbyAction.memberJoin({
      name,
      memberID: socket.id,
    });
    this.store.dispatch(memberJoinAction);
    io.to(this.id).emit("action", actionFromServer(memberJoinAction));

    socket.join(this.id);
    const hydrateAction = LobbyAction.hydrate(this.store.getState());
    socket.emit("action", actionFromServer(hydrateAction));

    // Hydrate game too
    if (this.game) {
      const hydrateGameAction = GameAction.hydrate(this.game.store.getState());
      socket.emit("action", actionFromServer(hydrateGameAction));
    }
  }
  onAction(action: AnyAction, socket: Socket, io: Server) {
    const clientStartGame = LobbyAction.clientStartGame.type;
    const clientLeaveGame = LobbyAction.clientLeaveGame.type;
    const clientRejoinGame = LobbyAction.clientRejoinGame.type;
    if (action.type === clientStartGame) {
      // Safeguard
      if (this.game !== null) {
        return;
      }
      const numPlayers = this.store.getState().memberIDs.length;
      if (numPlayers < GameMinPlayers || numPlayers > GameMaxPlayers) {
        return;
      }

      // Create game
      const gameOptions: GameInitOptions = {
        socketIDs: this.store.getState().memberIDs,
        names: this.store.getState().names,
        // Should be good enough
        seed: new Date().getTime() % 10_000,
        gamemode: this.store.getState().gameInitOptions,
      };
      this.game = new Game(gameOptions, this.id);

      // Get everyone to join game
      const hydrateGameStateAction = GameAction.hydrate(
        this.game.store.getState()
      );
      io.to(this.id).emit("action", actionFromServer(hydrateGameStateAction));

      const updateGameStateAction = LobbyAction.updateGameState({
        inGame: true,
      });
      this.store.dispatch(updateGameStateAction);
      io.to(this.id).emit("action", actionFromServer(updateGameStateAction));

      // Start game
      this.game.start(io);
    } else if (action.type === clientLeaveGame) {
      this.handleUserLeaveGame(socket, io);
    } else if (action.type === clientRejoinGame) {
      if (this.game) {
        this.game.onRejoin(socket.id, action.payload.index, io);
      }
    } else if ((action.type as string).startsWith("lobby/")) {
      this.store.dispatch(action);
      io.to(this.id).emit("action", actionFromServer(action));
    } else if ((action.type as string).startsWith("game/")) {
      if (this.game) {
        this.game.onAction(action, socket, io);
      }
    }
  }
  onLeave(socket: Socket, io: Server) {
    this.handleUserLeaveGame(socket, io);

    const memberLeaveAction = LobbyAction.memberLeave({ memberID: socket.id });
    this.store.dispatch(memberLeaveAction);
    io.to(this.id).emit("action", actionFromServer(memberLeaveAction));
  }
  // Used twice
  handleUserLeaveGame(socket: Socket, io: Server) {
    if (this.game) {
      this.game.onLeave(socket.id, io);
      const socketIDs = this.game.store.getState().player.socketIDs;
      const count = socketIDs.reduce((a, v) => (v === null ? a : a + 1), 0);
      if (count === 0) {
        this.game.stop();
        this.game = null;
        const updateGameStateAction = LobbyAction.updateGameState({
          inGame: false,
        });
        this.store.dispatch(updateGameStateAction);
        io.to(this.id).emit("action", actionFromServer(updateGameStateAction));
      }
    }
  }
}

type GameStore = EnhancedStore<GameState, AnyAction>;

export class Game {
  roomID: string;
  timeout: NodeJS.Timeout | null;
  store: GameStore;
  constructor(options: GameInitOptions, roomID: string) {
    this.roomID = roomID;
    this.store = configureStore({
      reducer: GameReducer,
    });
    this.store.dispatch(GameAction.initialize(options));
    this.timeout = null;
  }
  start(io: Server) {
    setInterval(() => this.tick(io), 1000);
  }
  stop() {
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }
  tick(io: Server) {
    const tickAction = GameAction.tick();
    this.store.dispatch(tickAction);
    io.to(this.roomID).emit("action", actionFromServer(tickAction));
    if (this.store.getState().game.phase === "finished") {
      this.stop();
    }
  }
  onAction(action: AnyAction, socket: Socket, io: Server) {
    this.store.dispatch(action);
    io.to(this.roomID).emit("action", actionFromServer(action));
  }
  onRejoin(socketID: string, index: number, io: Server) {
    const playerRejoinAction = GameAction.playerReconnect({ index, socketID });
    this.store.dispatch(playerRejoinAction);
    io.to(this.roomID).emit("action", actionFromServer(playerRejoinAction));
  }
  onLeave(socketID: string, io: Server) {
    const playerDisconnectAction = GameAction.playerDisconnect({ socketID });
    this.store.dispatch(playerDisconnectAction);
    io.to(this.roomID).emit("action", actionFromServer(playerDisconnectAction));
  }
}
