import Post from '../models/post.model.js';
import User from '../models/user.models.js';

import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        const userId = req.user._id.toString()

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

        const newposts = await Post.find()
        res.status(200).json({ message: "Post deleted successfully", posts: newposts })
    } catch (error) {
        console.error("Error in deletePost controller: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userid = req.user._id;

        const thatPost = await Post.findById(id).populate("user");

        if (!thatPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const hasLike = thatPost.likes.includes(userid);
        let updatedPost;

        if (!hasLike) {
            updatedPost = await Post.findByIdAndUpdate(
                id,
                { $push: { likes: userid } },
                { new: true } // Returns the updated document
            );
            if (thatPost.user._id.toString() !== userid.toString()) {
                const newNotification = new Notification({
                    type: "like",
                    from: userid,
                    to: thatPost.user._id,
                    toModel: thatPost._id
                });
                await newNotification.save();
            }

            return res.status(201).json({
                message: "Liked successfully",
                likes: updatedPost.likes, // Return updated likes
                text: "like",
            });
        } else {
            updatedPost = await Post.findByIdAndUpdate(
                id,
                { $pull: { likes: userid } },
                { new: true } // Returns the updated document
            );

            return res.status(201).json({
                message: "Unliked successfully",
                likes: updatedPost.likes, // Return updated likes
                text: "unlike",
            });
        }
    } catch (error) {
        console.error("Error in Liking/Unliking:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const commentOnPost = async (req, res) => {
    try {

        const userId = req.user._id
        const { text } = req.body

        const id = req.params.id

        const updatedPost = await Post.findByIdAndUpdate(id, { $push: { comments: { text, user: userId } } }, { new: true }).populate({
            path: "comments",
            populate: {
                path: "user",
                select: "-password"
            }
        })
        res.status(200).json({ message: "Commented successfully", comments: updatedPost.comments })
        if (updatedPost.user._id.toString() !== userId.toString()) {
            const newnotification = new Notification({
                type: "comment",
                from: userId,
                to: updatedPost.user._id,
                toModel: updatedPost._id
            })
            await newnotification.save()
        }
    } catch (error) {
        console.error("Error in Comment Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getCommentsOFPost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id).populate({
            path: "comments",
            populate: {
                path: "user",  // Assuming each comment has a `user` reference
                select: "-password"
            }
        })
        const allcomments = post.comments
        res.status(200).json({ allcomments, presentuserid: req.user._id })
    } catch (error) {
        console.error("Error in getCommentsOFPost Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const commentid = req.params.id
        const { postid } = req.body

        const updatedpost = await Post.findByIdAndUpdate(postid, { $pull: { comments: { _id: commentid } } }, { new: true })

        res.status(201).json({ message: "comment deleted Succesfully", comments: updatedpost.comments })
    } catch (error) {
        console.error("Error in commentdelete Handler:", error.message)
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
        res.status(200).json({ allposts, presentuser: req.user._id })
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
        const posts = await Post.find({ user: { $in: req.user.following } }).populate({
            path: "user", select
                : "-password"
        }).populate({ path: "comments.user", select: "-password" }).sort({ createdAt: -1 })
        if (posts.length === 0) {
            return res.json({ message: "No Posts Found" })
        }
        res.status(200).json({ allposts: posts, presentuser: req.user._id })
    } catch (error) {
        console.error("Error in FollowingPosts Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const userPosts = async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const posts = await Post.find({ user: user._id }).populate({
            path: "user", select
                : "-password"
        }).populate({ path: "comments.user", select: "-password" }).sort({ createdAt: -1 })

        res.status(200).json(posts)
    } catch (error) {
        console.error("Error in userPosts Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const onePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        }).populate({
            path: "likes",
            select: "-password"
        })
        res.status(200).json(post)
    } catch (error) {
        console.error("Error in userSinglePost Handler:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
