import React, { useContext, useEffect } from "react";
import { Request, Action } from "common-types";
import io from "socket.io-client";
import { useStore } from "../store";

// Create socketIO client
let address = "";
if (window.location.hostname === "localhost") {
  address = ":8080";
}
const socket = io(address);
socket.on("connect", () => {
  console.log("Connected with ID " + socket.id);
});

// Create context so that it can be used everywhere
const SocketContext = React.createContext(socket);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useStore();
  useEffect(() => {
    socket.on("message", (data: Action) => {
      console.log("Message:", data);
      dispatch(data);
    });
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

interface ISocket {
  id: string;
  emit: (m: "message", request: Request) => void;
}

export function useSocket(): ISocket {
  return useContext(SocketContext);
}
