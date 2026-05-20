import { Server } from "socket.io";

export let io;

export const userSocketMap = {};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://chatclone-sigma.vercel.app"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // JOIN
    socket.on("join", (userId) => {
      userSocketMap[userId] = socket.id;

      io.emit("onlineUsers", Object.keys(userSocketMap));
    });

    // SEND MESSAGE
    socket.on("sendMessage", (message) => {
      const receiverSocketId = userSocketMap[message.receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }
    });

    // TYPING
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = userSocketMap[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", senderId);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);

      for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];

          break;
        }
      }

      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
  });
};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};
