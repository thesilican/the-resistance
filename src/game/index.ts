import {} from "common-modules";
import socketIO from "socket.io";

export function start(io: socketIO.Server) {
  io.on("connect", onConnection);
}

function onConnection(socket: socketIO.Socket) {
  console.log("New Connection:", socket.id);
  socket.on("disconnect", () => {});
}
