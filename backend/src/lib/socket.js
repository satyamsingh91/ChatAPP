// lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express(); // Express app created
const server = http.createServer(app); // Create HTTP server with app

// ✅ Correct Socket.IO instance with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Frontend URL
    methods: ["GET", "POST"],
  },
});

export function getReceiverSocketId (userId)  {
  return userSocketMap[userId]
}

// ✅ Object to store online users { userId: socketId }
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // ✅ Get userId from socket query params

  const userId = socket.handshake.query.userId;
  console.log(userId, "userrr");
  // ✅ Store socket.id if userId is valid
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // ✅ Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // ✅ Remove user from userSocketMap when disconnected
    if (userId) {
      delete userSocketMap[userId];
    }

    // ✅ Update online users list after disconnect
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
