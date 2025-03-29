
import Notification from '../models/notification.model.js';


export const getAllNotifications = async (req, res) => {
    try {
        const allnotifications = await Notification.find({ to: req.user._id }).populate({
            path: "from",
            select: "username profileImg"
        }).sort({ createdAt: -1 })

        if (allnotifications.length === 0) {
            return res.status(404).json({ error: "No notifications found" });
        }

        // ✅ Corrected update query
        await Notification.updateMany(
            { to: req.user._id },
            { $set: { read: true } }
        );

        res.status(200).json(allnotifications);
    } catch (error) {
        console.error("Error in getAllNotifications Handler:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const notification = await Notification.deleteMany({ to: req.user._id }, { new: true })
        res.status(200).json({ message: "All notifications deleted" });
    } catch (error) {
        console.error("Error in deleteNotifications Handler:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
