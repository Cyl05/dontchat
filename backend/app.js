import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
app.use(cors());

const port = 3000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected " + socket.id);
    socket.on("message", (msg) => {
        console.log(msg);
    });
});

server.listen(3000, () => {
    console.log("Listening on port " + port);
});