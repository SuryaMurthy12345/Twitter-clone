import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //parse application/x-www-form-urlencoded

app.use(cookieParser())

dotenv.config()
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