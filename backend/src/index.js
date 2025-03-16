//imports 
import express from "express"
import dotenv from "dotenv"
import fileUpload from "express-fileupload";
import cors from "cors"
import path from "path"
dotenv.config()
const app=express()
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from "./lib/db.js"
import cookieParser from 'cookie-parser'






// env secrets
const PORT=process.env.PORT

//Middlewares
app.use(fileUpload());
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))


//Routes
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)


//Server Start
app.listen(PORT,()=>{
    console.log("Server is running on PORT:" + PORT);
    connectDB()
})