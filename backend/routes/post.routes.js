import e from "express";

import { allPosts, commentOnPost, createPost, deleteComment, deletePost, FollowingPosts, getCommentsOFPost, getLikedPosts, likeUnlikePost, onePost, userPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = e.Router()

router.post("/create", protectRoute, createPost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.delete("/delete/:id", protectRoute, deletePost)

router.delete("/deletecomment/:id", protectRoute, deleteComment)

router.get("/getAllComments/:id", protectRoute, getCommentsOFPost)

router.get("/", protectRoute, allPosts)

router.get("/likedposts", protectRoute, getLikedPosts)

router.get("/getFollowingPosts", protectRoute, FollowingPosts)

router.get("/user/:username", protectRoute, userPosts)

router.get("/onepost/:id", protectRoute, onePost)



export default router