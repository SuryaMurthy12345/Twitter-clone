import { v2 as cloudinary } from "cloudinary";
import Post from '../models/post.model.js';
import User from '../models/user.models.js';

export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        const userId = req.user._id.toString()

        if (!text && !img) {
            return res.status(400).json({ error: "Text or Image is required" })
        }

        const user = await User.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newpost = new Post({
            user: userId,
            text, img,
        })

        await newpost.save()
        res.status(200).json(newpost
        )
    } catch (error) {
        console.error("Error in createPost controller: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params

        await Post.findByIdAndDelete(id)
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.error("Error in deletePost controller: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id } = req.params
        const userid = req.user._id

        const thatPost = await Post.findById(id)

        const hasLike = thatPost.likes.includes(userid)

        if (!hasLike) {
            await Post.findByIdAndUpdate(id, { $push: { likes: userid } })
            res.status(201).json({ message: "Liked successfully" })
        }
        else {
            await Post.findByIdAndUpdate(id, { $pull: { likes: userid } })
            res.status(201).json({ message: "UnLiked successfully" })

        }



    } catch (error) {
        console.error("Error happened while Liking/unliking controller:", error.message)
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const commentOnPost = async (req, res) => {
    try {

        const userId = req.user._id
        const { text } = req.body

        const id = req.params.id

        await Post.findByIdAndUpdate(id, { $push: { comments: { text, user: userId } } })
        res.status(200).json({ message: "Commented successfully" })
    } catch (error) {
        console.error("Error in Comment Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getCommentsOFPost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        const allcomments = post.comments
        res.status(200).json(allcomments)
    } catch (error) {
        console.error("Error in getCommentsOFPost Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}


export const allPosts = async (req, res) => {
    try {
        const allposts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        }).populate({
            path: "likes",
            select: "-password"
        })
        if (allposts.length === 0) {
            res.json({ message: "No Posts Found" })
        }
        res.status(200).json(allposts)
    } catch (error) {
        console.error("Error in allPosts Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const userid = req.user._id
        const likedposts = await Post.find({ likes: userid }).populate({ path: "user", select: "-password" }).populate({ path: "comments.user", select: "-password" })
        if (likedposts.length === 0) {
            return res.json({ message: "No liked Posts Found" })
        }
        res.status(200).json(likedposts)
    } catch (error) {
        console.error("Error in getLikedPosts Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const FollowingPosts = async (req, res) => { 
try {
    const followingUsers = req.user.following || []; 
    console.log(followingUsers)
    const posts = await Post.find({user:{$in:req.user.following}}).populate({path:"user",select
    :"-password"}).populate({path:"comments.user",select:"-password"}).sort({createdAt:-1})
    if(posts.length===0){
        return res.json({message:"No Posts Found"})
    }
    res.status(200).json(posts)
} catch (error) {
    console.error("Error in FollowingPosts Handler:", error.message)
    res.status(500).json({error:"Internal Server Error"})
}
}

export const userPosts = async (req, res) =>{
    try {
        const {username} = req.params 
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({error:"User not found"})
        } 
        const posts = await Post.find({user:user._id}).populate({path:"user",select
        :"-password"}).populate({path:"comments.user",select:"-password"}).sort({createdAt:-1}) 

        res.status(200).json(posts)
    } catch (error) {
        console.error("Error in userPosts Handler:", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}