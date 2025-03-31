import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.routes.js';
import notificationRoutes from "./routes/notification.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from './routes/user.routes.js';

const app = express()
app.use(
    cors({
        origin: "https://frontend-lpt8fgfuu-murthys-projects-2b9aff5c.vercel.app/signin", // Allow frontend origin
        credentials: true, // Allow cookies
    })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //parse application/x-www-form-urlencoded
app.use('/uploads', express.static('uploads'));

app.use(cookieParser())


dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/posts", postRoutes)

app.use("/api/notification", notificationRoutes)

app.get('/', (req, res) => {
    res.send("Server is ready")
})


app.get("/check-cookie", (req, res) => {
    console.log("Cookies:", req.cookies);
    res.json({ cookies: req.cookies });
});

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "no file uploaded" })

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "posts" },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
        })
        res.json({ imageUrl: result.secure_url })
    }
    catch (err) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Image upload failed" });
    }
})



app.post("/upload/profile", upload.array("image", 2), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "profileImages" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
        });

        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map((result) => result.secure_url);

        res.json(imageUrls
        );

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Image upload failed" });
    }
});



const port = process.env.port || 8000
app.listen(port, () => {
    connectDB()
    console.log(`Server is Running: http://localhost:8000`)
})