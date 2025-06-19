import { io } from "socket.io-client";

const socket = io(import.meta.env.BACKEND_URL);

export default socket;