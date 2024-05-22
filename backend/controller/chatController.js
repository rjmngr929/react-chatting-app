import ChatModel from "../models/ChatData.js";
import User from "../models/UserData.js";



export const accessChat = async (req, res) => {

    const {userId} = req.body;

    if(!userId){
        console.log("UserId param not sent with request");
        return res.status(400).send({status: false, message: "UserId param not sent with request"})
    }
     
    var isChat = await ChatModel.find({
        isGroupChat: false,
        $and:[
            {users: {$elemMatch:{$eq:req.user._id} } },
            {users: {$elemMatch:{$eq:userId} } },
        ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat,{
        path: "latestMessage.sender",
        select: "name profile email",
    })

    // console.log("isChat data value");
    // console.log(isChat, isChat.length);

    if(isChat.length > 0){
        // res.send(isChat[0]);
        res.status(200).send({status: true, message: "chat fetch success!", data:isChat[0]})
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try{
            const createdChat = await ChatModel.create(chatData)
            const fullChat = await ChatModel.find({_id: createdChat._id}).populate("users", "-password");

            res.status(200).send({status: true, message: "chat fetch success!", data:fullChat})

        }
        catch(err){
            res.status(400).send({status: false, message: err})
        }
    }

}

export const fetchChat = async (req, res) => {

    ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
        results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name profile email",
        });
        res.status(200).send({status: true, message: "data fetch success!", data: results});
        })
        .catch((err) => {
        res.status(400).send({status: false, message: "data fetch failed!"});
        });

}

export const createGroupChat = async (req, res) => {

    if(!req.body.users || !req.body.name){
        res.status(400).send({status: false, message: "Please Fill all the fields"})
    }

    var users = JSON.parse(req.body.users)

    if(users.length < 2){
        return res.status(400).send({status: false, message:"More than 2 users are required to form a group chat"})
    }
     
    users.push(req.user);

    try{
        const groupChat = await ChatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat = await ChatModel.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).send({status: true, message: "Group create success", data: fullGroupChat});
    }
    catch(err){
        res.status(400).send({status: false, message: err});
    }

}

export const renameGroup = async (req, res) => {
    const {chatId, chatName} = req.body;

    const updateChat = await ChatModel.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        },
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updateChat){
        // res.status(404);
        // throw new Error("Chat Not Found");
        res.status(404).send({status: false, message: "Chat Not Found!"});
    }
    else{
        res.status(200).send({status: true, message: "Group name change success!", data: updateChat});
    }
      
}

export const removeFromGroup = async (req, res) => {
    const {chatId, userId} = req.body;

    const removed = await ChatModel.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        },
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!removed){
        // res.status(404);
        // throw new Error("Chat Not Found");
        res.status(404).send({status: false, message: "Chat Not Found!"});
    }
    else{
        res.status(200).send({status: true, message: "Remove user success!", data: removed});
    }
     
}

export const addToGroup = async (req, res) => {
    const {chatId, userId} = req.body;

    const added = await ChatModel.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        },
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        // res.status(404);
        // throw new Error("Chat Not Found");
        res.status(404).send({status: false, message: "Chat Not Found!"});
    }
    else{
        res.status(200).send({status: true, message: "Add user success!", data: added});
    }
     
}