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
        console.log("Join request received: " + username + " " + roomName);
        socket.join("waiting");
        
        // Check if room doesn't exist in the members object
        if (!members[roomName]) {
            // Create new room and add first user
            members[roomName] = new Set([username]);
            owners[roomName] = username;
            invitesAllowed[roomName] = false; // Default setting for new rooms
            
            console.log(`${username} joining ${roomName}`);
            console.log("Current owners:", owners);
            console.log("Current members:", members);
            // Let user join immediately
            io.to("waiting").emit("join room", username, roomName);
            return;
        }
        
        // If room exists but is empty (shouldn't happen if we clean up properly)
        if (members[roomName].size === 0) {
            members[roomName].add(username);
            owners[roomName] = username;
            io.to("waiting").emit("join room", username, roomName);
            return;
        }
        
        // For rooms with members, check permissions
        if (invitesAllowed[roomName] === true) {
            io.to(roomName).emit("requesting", username);
        } else {
            // Direct join request to the room owner
            io.to(roomName).emit("requesting", username);
        }
    });

    socket.on("accepted user", (username, roomName) => {
        io.to("waiting").emit("join room", username, roomName);
        members[roomName].add(username);
        
        console.log(`${username} joining ${roomName}`);
        console.log("Current owners:", owners);
        console.log("Current members:", members);
    });

    socket.on("rejected user", (username) => {
        io.to("waiting").emit("reject user", username);
    });

    socket.on("duplicate name", (username) => {
        io.to("waiting").emit("name already exists", username);
    });

    socket.on("client-leaving", (username, roomName) => {
        socket.leave(roomName);
        
        // Check if the room exists in members
        if (members[roomName]) {
            members[roomName].delete(username);
            
            // If the room is now empty
            if (members[roomName].size === 0) {
                // Clean up all room state
                delete members[roomName];
                delete owners[roomName];
                delete invitesAllowed[roomName];
                console.log("Room cleaned up:", roomName);
            } else {
                // Transfer ownership if needed
                owners[roomName] = [...members[roomName]][0];
                io.to(roomName).emit("new owner", username);
            }
        }

        console.log(`${username} leaving ${roomName}`);
        console.log("Current owners:", owners);
        console.log("Current members:", members);
    });
});

server.listen(3000, () => {
    console.log("Listening on port " + port);
});