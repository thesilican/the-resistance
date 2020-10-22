import compression from "compression";
import express from "express";
import http from "http";
import path from "path";
import process from "process";

const app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

const httpServer = http.createServer(app);

const port = process.env.PORT ?? 8080;
httpServer.listen(port, () => {
  console.log("😎 Starting HTTP server on port " + port);
});
