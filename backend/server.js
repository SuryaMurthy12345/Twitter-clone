import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'
import {v2 as cloudinary} from "cloudinary"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //parse application/x-www-form-urlencoded

app.use(cookieParser()) 


dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

app.get('/', (req, res) => {
    res.send("Server is ready")
})

const port = process.env.port || 8000
app.listen(port, () => {
    connectDB()
    console.log(`Server is Running: http://localhost:8000`)
})