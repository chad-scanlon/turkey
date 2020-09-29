const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const server = express();

const authenticate = require("../auth/restricted-middleware.js");

const userRouter = require("../api/users/user-router.js");

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Turkey Bowl API!" });
});

module.exports = server;
