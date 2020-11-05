import { AnyAction } from "@reduxjs/toolkit";
import { LobbyAction } from "common-modules";
import socketIO, { Socket } from "socket.io";
import { Lobby } from "./lobby";
import { actionFromServer, generateUniqueID } from "./util";

export class Server {
  io: socketIO.Server;
  sockets: Map<string, string | null>;
  rooms: Map<string, Lobby>;
  constructor(io: socketIO.Server) {
    this.io = io;
    this.io.on("connection", this.onConnection.bind(this));
    this.sockets = new Map();
    this.rooms = new Map();
  }
  onConnection(socket: Socket) {
    console.log("Connect", socket.id);
    this.sockets.set(socket.id, null);
    socket.on("disconnect", () => this.onDisconnect(socket));
    socket.on("action", (action: AnyAction) => this.onAction(socket, action));
  }
  onDisconnect(socket: Socket) {
    console.log("Disconnect", socket.id);
    const roomID = this.sockets.get(socket.id);
    this.sockets.delete(socket.id);
    if (!roomID) return;
    const room = this.rooms.get(roomID);
    if (!room) return;
    room.onLeave(socket, this.io);
    if (room.store.getState().memberIDs.length === 0) {
      this.rooms.delete(roomID);
    }
  }
  onAction(socket: Socket, action: AnyAction) {
    // console.log(action);
    const clientCreateLobby = LobbyAction.clientCreateLobby.type;
    const clientJoinLobby = LobbyAction.clientJoinLobby.type;
    if (action.type === clientCreateLobby) {
      // Protect against accidental double create
      if (this.sockets.get(socket.id)) {
        return;
      }
      // Create a lobby
      const roomID = generateUniqueID();
      const room = new Lobby(roomID);
      this.rooms.set(roomID, room);
      this.sockets.set(socket.id, room.id);
      room.onJoin(action.payload.name, socket, this.io);
    } else if (action.type === clientJoinLobby) {
      // Protect against accidental double create
      if (this.sockets.get(socket.id)) return;
      const room = this.rooms.get(action.payload.roomID);
      if (!room) {
        socket.emit(
          "action",
          actionFromServer({ type: "error", error: "Invalid room code" })
        );
        return;
      }
      this.sockets.set(socket.id, room.id);
      room.onJoin(action.payload.name, socket, this.io);
    } else {
      const roomID = this.sockets.get(socket.id);
      if (!roomID) return;
      const room = this.rooms.get(roomID);
      if (!room) return;
      room.onAction(action, socket, this.io);
    }
  }
}
