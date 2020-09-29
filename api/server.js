const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const server = express();

const authenticate = require("../auth/restricted-middleware.js");

const playerRouter = require("../api/players/player-router");

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/players", playerRouter);

server.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Turkey Bowl API!" });
});

module.exports = server;
