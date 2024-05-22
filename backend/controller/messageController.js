import messageModel from "../models/MessageModel.js";
import User from "../models/UserData.js";
import Chat from "../models/ChatData.js";
import Message from "../models/MessageModel.js"



export const allMessages = async (req, res) => {
    
    if(req.params.chatId){
        try {
            const messages = await Message.find({ chat: req.params.chatId })
              .populate("sender", "name profile email")
              .populate("chat");
              res.status(200).send({status: true, message: "All messages fetch success!", data: messages})
          } catch (error) {
            res.status(400).send({status: false, message: error.message})
          }
    }
    else{
        res.status(400).send({status: false, message:"Please send chatId!"})
    }
    

}

export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
    //   return res.sendStatus(400);
        return res.status(400).send({status: false, message: "Invalid data passed into request"})
    }
  
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name profile");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name profile email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      res.status(200).send({status: true, message: "Message send success!", data: message})
    //   res.json(message);
    } catch (error) {
    //   res.status(400);
    //   throw new Error(error.message);
        res.status(400).send({status: false, message: error.message})
    }

}