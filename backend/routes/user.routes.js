import express from "express";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser, CheckFollowORUnfollow,getAllUsers } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.get("/suggested", protectRoute, getSuggestedUsers)
router.post("/follow/:id", protectRoute, followUnfollowUser)
router.put("/update", protectRoute, updateUser) 

router.get("/check/:id",protectRoute,CheckFollowORUnfollow)

router.get("/",protectRoute,getAllUsers )




export default router