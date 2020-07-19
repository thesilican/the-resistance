import { Action } from "common-types";

// Simplified, stricter version of SocketIO.Socket
export interface ISocket extends IEmitter {
  id: string;
  join: (room: string) => void;
  rooms: any;
}

export interface IEmitter {
  to: (room: string) => { emit: (m: "message", data: Action) => void };
  in: (room: string) => { emit: (m: "message", data: Action) => void };
  emit: (m: "message", data: Action) => void;
}

export interface ISocketIO {
  of: (namespace: "/") => IEmitter;
  to: (room: string) => IEmitter;
}
