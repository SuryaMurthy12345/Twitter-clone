import Notificiation from "../models/notification.model.js"
import User from "../models/user.models.js"

export const getUserProfile = async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username })
        .select("-password")
        .populate("followers", "username fullName profileImg")
        .populate("following", "username fullName profileImg");

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error("Error in getUserProfile controller: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "you cant follow or unfollow yourself" })
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" })
        }

        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {
            //unfollow (super logic)
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })

            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })

            res.status(200).json({ message: "unfollowed successfully", text: "Follow" })
        }
        else {
            //follow (wow super logic)
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })

            const newnotification = new Notificiation({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
                toModel: req.user._id
            })

            await newnotification.save()

            res.status(200).json({ message: "followed successfully", text: "Unfollow" })
        }


    } catch (error) {
        console.error("Error in followUnfollowUser controller: ", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id
        const usersFollowedByMe = await User.findById(userId).select("following")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            { $sample: { size: 10 } }
        ])

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id))

        const suggestedUsers = filteredUsers.slice(0, 9)

        res.status(200).json(suggestedUsers)
    } catch (error) {

    }
}
export const updateUser = async (req, res) => {
    const { fullName, username, bio, link, email } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Update user fields
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        // Save and send response without password
        await user.save();
        const updatedUser = await User.findById(userId).select("-password");

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateUser controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const CheckFollowORUnfollow = async(req,res)=>{
    try {
        const userid = req.user._id 
        const personid = req.params.id 

        const user = await User.findById(userid) 

        let follow = user.following.includes(personid) 
        let text=""
        follow ? text="Unfollow" : text="Follow" 
        
        res.status(200).json({text})
    } catch (error) {
        console.error("Error in Check controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

