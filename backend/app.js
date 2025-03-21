import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

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

let invitesAllowed = {};
let owners = {};
let members = {};

io.on("connection", (socket) => {
    socket.on("message", (msg, roomName, username) => {
        io.to(roomName).emit('message', msg, username);
    });

    socket.on("connectRoom", (roomName, isOpen, username) => {
        socket.join(roomName);

        if (!members[roomName]) {
            io.to(roomName).emit("kick out", username);
        }

        if (!invitesAllowed[roomName]) {
            owners[roomName] = username;
            invitesAllowed[roomName] = isOpen;
        }
        if (username == owners[roomName]) {
            invitesAllowed[roomName] = isOpen;
        }
        io.to(roomName).emit("room owner", owners[roomName]);
    });

    socket.on("join request", (username, roomName) => {
        socket.join("waiting");
        if (!members[roomName]) {
            members[roomName] = new Set([username]);
            io.to("waiting").emit("join room", username, roomName);
        }
        if (invitesAllowed[roomName] == true) {
            io.to(roomName).emit("requesting", username);
        } else {
            io.to("waiting").emit("join room", username, roomName);
        }
    });

    socket.on("accepted user", (username, roomName) => {
        io.to("waiting").emit("join room", username, roomName);
        members[roomName].add(username);
    });

    socket.on("rejected user", (username) => {
        io.to("waiting").emit("reject user", username);
    });

    socket.on("duplicate name", (username) => {
        io.to("waiting").emit("name already exists", username);
    });

    socket.on("client-leaving", (username, roomName) => {
        // rooms[roomName].delete(username);
        // if (rooms[roomName].size == 0) {
        //     delete rooms[roomName];
        // }
    });
});

server.listen(3000, () => {
    console.log("Listening on port " + port);
});