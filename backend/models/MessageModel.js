import mongoose from "mongoose"
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "MyUser",
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ChatModel",
    },
},
{
    timestamps: true
}
)

export default mongoose.model("Message", messageSchema)