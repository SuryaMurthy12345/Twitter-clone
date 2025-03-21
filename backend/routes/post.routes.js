import e from "express";
import { createPost,deletePost, likeUnlikePost, commentOnPost,getCommentsOFPost,allPosts, getLikedPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = e.Router() 

router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,commentOnPost)
router.delete("/delete/:id",protectRoute,deletePost) 

router.get("/getAllComments/:id",protectRoute,getCommentsOFPost) 

router.get("/",protectRoute,allPosts)

router.get("/likedposts",protectRoute,getLikedPosts)

export default router