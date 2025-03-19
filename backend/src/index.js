// index.js or server.js
import dotenv from "dotenv";
import express from "express"
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js"; // Correctly importing app and server
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

// ENV secrets
const PORT = process.env.PORT;

// Middlewares
app.use(fileUpload());
app.use(express.json()); // This should work fine now
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Server Start
server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDB();
});
