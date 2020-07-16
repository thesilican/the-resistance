import { JoinRoomRequest, LobbyRequest, GameRequest } from "common-types";
import { Socket } from "dgram";
import { ISocket, ISocketIO } from "./ISocket";
import { Game } from "./Game";

export type LobbyMember = {
  id: string;
  name: string;
};

export class Lobby {
  io: ISocketIO;
  id: string;
  members: LobbyMember[];
  game: Game | null;

  constructor(id: string, io: ISocketIO) {
    this.id = id;
    this.members = [];
    this.game = null;
    this.io = io;
  }

  onJoin(socket: ISocket, name: string) {
    // Verify that name doesn't exist
    if (this.members.find((m) => m.name === name)) {
      // TODO: throw error
      return;
    }

    this.members.push({
      id: socket.id,
      name,
    });
    socket.join(this.id);
    socket.emit("message", {
      category: "lobby",
      type: "join-lobby",
      roomID: this.id,
      roomMembers: this.members.map((m) => m.name),
      roomIndex: this.members.length - 1,
      game: this.game?.getClientState(socket.id) ?? null,
    });
    socket.to(this.id).emit("message", {
      category: "lobby",
      type: "player-join",
      name: name,
    });
  }

  onLeave(socket: ISocket) {
    let index = this.members.findIndex((m) => m.id === socket.id);
    if (index === -1) {
      return;
    }
    // Leave Game
    if (this.game && this.game.socketIDs.includes(socket.id)) {
      this.game.onLeave(socket);
      // Remove game once everyone left
      if (!this.game.socketIDs.find((id) => id !== null)) {
        this.game = null;
        socket.in(this.id).emit("message", {
          category: "game",
          type: "update-game-state",
          state: null,
        });
      }
    }

    this.members.splice(index, 1);
    socket.in(this.id).emit("message", {
      category: "lobby",
      type: "player-leave",
      index: index,
    });
  }
  
  onMessage(socket: ISocket, message: LobbyRequest | GameRequest) {
    if (message.category === "lobby") {
      if (message.type === "start-game") {
        // TODO: Add verification to ensure that it is host starting the game
        if (this.game) return;
        let game: Game;
        // Catch any errors on creating the game
        try {
          game = new Game({
            players: this.members,
            io: this.io,
            roomID: this.id,
          });
          game.start();
        } catch {}
        this.game = game!;
      } else if (message.type === "leave-game") {
        if (!this.game) return;
        this.game.onLeave(socket);
        // Remove game once everyone left
        if (!this.game.socketIDs.find((id) => id !== null)) {
          this.game = null;
          socket.in(this.id).emit("message", {
            category: "game",
            type: "update-game-state",
            state: null,
          });
        }
      } else if (message.type === "rejoin-game") {
        if (!this.game) return;
        this.game.onRejoin(socket, message.index);
      }
    } else if (message.category === "game") {
      if (this.game) {
        this.game.onMessage(socket, message);
      }
    }
  }
}
