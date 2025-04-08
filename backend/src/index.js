import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js"; // Ensure correct import
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import path from "path";

// Load environment variables
dotenv.config();

// Ensure PORT is set
const PORT = process.env.PORT || 3000;
const __dirname =path.resolve()

// Connect to MongoDB
connectDB();

// Middlewares
app.use(fileUpload());
// app.use(express.json());
app.use(express.json({limit: '50mb' })); 
app.use(express.urlencoded({limit: '50mb' , extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Ensure frontend URL is correct
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
  })
}

// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server is running on PORT: ${PORT}`);
});
