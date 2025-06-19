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
        origin: [
            "http://localhost:5173",
            "https://dontchat-cyl18.vercel.app"
        ],
        methods: ["GET", "POST"]
    }
});

let roomOpen = {};
let owners = {};
let members = {};

io.on("connection", (socket) => {
    socket.on("message", (msg, roomName, username, bgColor, color) => {
        io.to(roomName).emit('message', msg, username, bgColor, color);
    });

    socket.on("connectRoom", (roomName, isOpen, username) => {
        socket.join(roomName);

        if (username == owners[roomName]) {
            roomOpen[roomName] = isOpen;
        }

        if (members[roomName] === undefined) {
            members[roomName] = new Set([username]);
            owners[roomName] = username;
            roomOpen[roomName] = isOpen;
        } else if (!members[roomName].has(username) && roomOpen[roomName] === false) {
            io.to(roomName).emit("kick out", username);
            socket.leave(roomName);
            socket.join("waiting");
            io.to(roomName).emit("requesting", username);
            return;
        }
        io.to(roomName).emit("room owner", owners[roomName]);
    });

    socket.on("join request", (username, roomName) => {
        socket.join("waiting");
        const newNameSuffix = Math.floor(Math.random() * 100);
        
        if (!members[roomName]) {
            members[roomName] = new Set([username]);
            owners[roomName] = username;
            roomOpen[roomName] = false;
            io.to("waiting").emit("join room", username, roomName);
            socket.leave("waiting");
            return;
        } else {
            if (members[roomName].has(username)) {
                io.to("waiting").emit("change name", username, newNameSuffix);
                username = `${username}${newNameSuffix}`;
            }
        }
        
        if (members[roomName].size === 0) {
            members[roomName].add(username);
            owners[roomName] = username;
            io.to("waiting").emit("join room", username, roomName);
            socket.leave("waiting");
            return;
        }
        
        if (roomOpen[roomName] === false) {
            io.to(roomName).emit("requesting", username);
        } else {
            io.to("waiting").emit("join room", username, roomName);
        }
    });

    socket.on("accepted user", (username, roomName) => {
        io.to("waiting").emit("join room", username, roomName);
        socket.leave("waiting");
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
        
        if (members[roomName]) {
            members[roomName].delete(username);
            
            if (members[roomName].size === 0) {
                delete members[roomName];
                delete owners[roomName];
                delete roomOpen[roomName];
            } else {
                owners[roomName] = [...members[roomName]][0];
                io.to(roomName).emit("new owner", username);
            }
        }

        io.to(roomName).emit("send room leave message", username);
    });

    socket.on("redirecting to new room", (username, roomName) => {
        socket.to(roomName).emit("send room join message", username);
    });

    socket.on("room open change", (isOpen, roomName) => {
        roomOpen[roomName] = isOpen;
    });
});

server.listen(3000, () => {
    console.log("Listening on port " + port);
});