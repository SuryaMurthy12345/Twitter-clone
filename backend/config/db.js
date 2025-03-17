import mongoose from "mongoose"; 

export const connectDB = async()=>{ 
    try{
    const conn = await mongoose.connect(process.env.Mongo_url) 
    console.log("MongoDB Connected: ",conn.connection.host)
    } 
    catch(error){ 
        console.log("Failed to Connect to database:",error.message)
    }
}