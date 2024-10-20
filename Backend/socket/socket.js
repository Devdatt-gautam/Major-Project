import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://antiprofanityfrontend.onrender.com",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

export const getRecepientSocketId = (recepientId) => {
  return userSocketMap[recepientId];
};
const userSocketMap = {}; //userId:socketId

io.on("connection", (socket) => {
  console.log("user Connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
