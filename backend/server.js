import express from "express"; 
import authRoutes from './routes/auth.routes.js'
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
const app = express() 

dotenv.config()
app.use("/api/auth",authRoutes)

app.get('/',(req,res)=>{ 
    res.send("Server is ready")
})

const port = process.env.port || 8000
app.listen(port,()=>{  
    connectDB()
    console.log(`Server is Running: http://localhost:8000`)
})