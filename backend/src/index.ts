import express from "express";
import http from "http";
import path from "path";
import process from "process";
import socketIO from "socket.io";
import { Server } from "./server";

const app = express();

const httpServer = http.createServer(app);

const io = new socketIO.Server(httpServer);
const server = new Server(io);

const port = process.env.PORT ?? 8080;
httpServer.listen(port, () => {
  console.log("Starting HTTP server on port " + port);
});
httpServer.addListener("close", () => {
  console.log("HTTP server closed");
});

app.get("/api/statistics", (req, res) => {
  const players = server.sockets.size;
  const lobbies = server.rooms.size;
  const games = Array.from(server.rooms.values()).map(
    (x) => x.game !== null
  ).length;
  return res.json({
    players,
    lobbies,
    games,
  });
});

app.use(express.static(path.join(__dirname, "../../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
});

// Handle SIGINT and SIGTERM
const handler = () => {
  httpServer.close();
  io.close();
};
process.on("SIGINT", handler);
process.on("SIGTERM", handler);
