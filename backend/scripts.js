const initialiseRoomSettings = (io, roomId) => {
    io.to(roomId).emit("open settings");
};

export { initialiseRoomSettings };