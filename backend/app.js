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
    console.log(socket.id);
    socket.on("message", (msg, roomName, username) => {
        io.to(roomName).emit('message', msg, username);
    });

    socket.on("connectRoom", (roomName, isOpen, username) => {
        socket.join(roomName);

        if (username == owners[roomName]) {
            invitesAllowed[roomName] = isOpen;
        }

        if (!members[roomName]) {
            io.to(roomName).emit("kick out", username);
        }

        if (!invitesAllowed[roomName]) {
            owners[roomName] = username;
            invitesAllowed[roomName] = isOpen;
        }
        io.to(roomName).emit("room owner", owners[roomName]);
    });

    socket.on("join request", (username, roomName) => {
        socket.join("waiting");
        io.in("waiting").fetchSockets().then((sockets) => {
            sockets.forEach((socket) => {
                console.log(`Socket ID: ${socket.id}`);
            });
        });
        if (invitesAllowed[roomName] == true) {
            io.to(roomName).emit("requesting", username);
        } else {
            io.to("waiting").emit("join room", username, roomName);
        }
        if (!members[roomName]) {
            members[roomName] = new Set([username]);
            io.to("waiting").emit("join room", username, roomName);
        } else if (members[roomName].size == 0) {
            members[roomName].add(username);
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
        socket.leave(roomName);
        io.in(roomName).fetchSockets().then((sockets) => {
            sockets.forEach((socket) => {
                console.log(`Socket ID: ${socket.id}`);
            });
        });
        members[roomName].delete(username);
        const membersList = members[roomName];
        if (membersList.size != 0) {
            owners[roomName] = [...membersList][0];
            io.to(roomName).emit("new owner", username);
        } else {
            owners[roomName] = null;
        }
        console.log(owners);
        console.log(members);
    });
});

server.listen(3000, () => {
    console.log("Listening on port " + port);
});