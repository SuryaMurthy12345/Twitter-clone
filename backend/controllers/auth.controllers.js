import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.models.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ error: existingUser.username === username ? "Username already taken" : "Email already taken" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({ fullName, username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT & set cookie
        generateTokenAndSetCookie(newUser._id, newUser.username, res);

        res.status(201).json({
            _id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        });

    } catch (error) {
        console.error("Error in signup controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        generateTokenAndSetCookie(user._id, user.username, res);

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });

    } catch (error) {
        console.error("Error in login controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,  // Ensures security
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Error in logout controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMe = async (req, res) => { 
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Error in getMe controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
