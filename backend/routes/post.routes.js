import e from "express";

import { allPosts, commentOnPost, createPost, deletePost, FollowingPosts, getCommentsOFPost, getLikedPosts, likeUnlikePost, userPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js"; 

const router = e.Router()

router.post("/create", protectRoute, createPost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.delete("/delete/:id", protectRoute, deletePost)

router.get("/getAllComments/:id", protectRoute, getCommentsOFPost)

router.get("/", protectRoute, allPosts)

router.get("/likedposts", protectRoute, getLikedPosts)

router.get("/getFollowingPosts", protectRoute, FollowingPosts)

router.get("/user/:username", protectRoute, userPosts)


export default router