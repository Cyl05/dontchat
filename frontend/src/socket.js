import { io } from "socket.io-client";

console.log("Connecting to:", import.meta.env.VITE_BACKEND_URL);
const socket = io(import.meta.env.BACKEND_URL);

export default socket;