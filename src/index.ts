import process from "process";
import fs from "fs";
import path from "path";
import http from "http";
import express from "express";
import socketIO from "socket.io";
import { Util } from "./Util";
import { Server } from "./Server";

const app = express();
app.use("/join/:id", express.static(path.join(__dirname, "../frontend/build")));
app.use("/", express.static(path.join(__dirname, "../frontend/build")));
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  // pingTimeout: 5000 * 100,
});

const server = new Server(io);

httpServer.listen(process.env.PORT || 8080, () => {
  console.log("😎 Starting HTTP server on port " + (process.env.PORT || 8080));
});
