import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { initialiseRoomSettings } from "./scripts.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let rooms = {};

io.on("connection", (socket) => {
    socket.on("message", (msg, roomId, username) => {
        io.to(roomId).emit('message', msg, username);
    });

    socket.on("connectRoom", (roomId, username) => {
        socket.join(roomId);
        if (!rooms[roomId]) {
            rooms[roomId] = new Set();
            initialiseRoomSettings(io, roomId);
        }
        rooms[roomId].add(username);
    });

    socket.on("client-leaving", (username, roomName) => {
        rooms[roomName].delete(username);
        if (rooms[roomName].size == 0) {
            delete rooms[roomName];
        }
    });
});

server.listen(3000, () => {
    console.log("Listening on port " + port);
});