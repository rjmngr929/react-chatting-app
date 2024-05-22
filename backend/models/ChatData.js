import mongoose from "mongoose"
const { Schema } = mongoose;

const chatSchema = new Schema({
    chatName : {
        type: String,
        trim:true,
    },
    isGroupChat : {
        type : Boolean, 
        default : false,
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "MyUser",
    }],
    latestMessage:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message",
    },
    groupAdmin: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "MyUser",
    },
},
{
    timestamps: true
}
)

export default mongoose.model("ChatModel", chatSchema)