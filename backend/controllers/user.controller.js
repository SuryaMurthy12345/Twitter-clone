import user from "../models/user.models.js"
import User from "../models/user.models.js"

export const getUserProfile = async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username }).select("-password")

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error("Error in getUserProfile controller: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
} 

export const followUnfollowUser = async(req,res)=>{ 
    try {
        const {id} = req.params 
        const userToModify = await User.findById(id) 
        const currentUser = await User.findById(req.user._id)
        if(id===req.user._id.toString()){ 
            return res.status(400).json({error:"you cant follow or unfollow yourself"})
        } 

        if(!userToModify || !currentUser){ 
            return res.status(404).json({error:"User not found"})
        } 

        const isFollowing = currentUser.following.includes(id) 

        if(isFollowing){  
            //unfollow (super logic)
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}}) 

            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}}) 

            res.status(200).json({message:"unfollowed successfully"})
        }
        else{ 
            //follow (wow super logic)
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}}) 
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}}) 

            res.status(200).json({message:"followed successfully"})
        }


    } catch (error) {
        console.error("Error in followUnfollowUser controller: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}