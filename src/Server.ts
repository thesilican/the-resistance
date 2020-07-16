import SocketIO from "socket.io";
import { Lobby } from "./Lobby";
import { Request, Action } from "common-types";
import { Util } from "./Util";
import { ISocket, ISocketIO } from "./ISocket";

export class Server {
  io: ISocketIO;
  lobbies: { [roomID: string]: Lobby };
  sockets: { [socketID: string]: string | null };

  constructor(io: SocketIO.Server) {
    this.lobbies = {};
    this.sockets = {};
    this.io = io;
    io.on("connect", this.onConnect.bind(this));
  }
  onConnect(socket: SocketIO.Socket) {
    console.log("New Connection: ", socket.id);
    socket.on("disconnect", () => this.onDisconnect(socket));
    socket.on("message", (m: Request) => this.onMessage(socket, m));

    this.sockets[socket.id] = null;
  }
  onDisconnect(socket: ISocket) {
    console.log("Disconnect: ", socket.id);

    let roomID = this.sockets[socket.id];
    if (roomID && roomID in this.lobbies) {
      let lobby = this.lobbies[roomID];
      lobby.onLeave(socket);
      if (lobby.members.length === 0) {
        // Remove room if empty
        delete this.lobbies[roomID];
      }
    }
    delete this.sockets[socket.id];
  }
  onMessage(socket: ISocket, message: Request) {
    console.log(message);
    if (message.category === "server") {
      if (message.type === "create-room") {
        // TODO: add username verification
        // Create a room
        const id = Util.generateUniqueID();
        const lobby = new Lobby(id, this.io);
        this.lobbies[id] = lobby;

        this.sockets[socket.id] = id;
        lobby.onJoin(socket, message.name);
      } else if (message.type === "join-room") {
        // TODO: add username verification
        let lobby = this.lobbies[message.roomID];
        if (!lobby) {
          // TODO: Throw error
          return;
        }
        this.sockets[socket.id] = message.roomID;
        lobby.onJoin(socket, message.name);
      }
    } else {
      let lobbyID = this.sockets[socket.id];
      if (lobbyID && lobbyID in this.lobbies) {
        this.lobbies[lobbyID].onMessage(socket, message);
      }
    }
  }
}
