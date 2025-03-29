import mongoose from "mongoose"; 

const notificationSchema = new mongoose.Schema({ 

    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['follow','like','comment']
    },
    toModel: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        enum: ['User', 'Post']  // The model name to reference dynamically
    },
    read:{
        type:Boolean,
        default:false
    }

},{timestamps:true}) 

const notificiation = mongoose.model('Notification',notificationSchema)

export default notificiation