import express from "express";
import {user_auth} from "../middleware/auth.js"
import {accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controller/chatController.js"


const chatRoutes = express.Router()

//  Add user to chat list
chatRoutes.post("/",user_auth, accessChat)

//  fetch chatlist data
chatRoutes.get("/",user_auth, fetchChat)
// chatRoutes.get("/", fetchChat)

//  create group 
chatRoutes.post("/group",user_auth, createGroupChat)

//  Rename group
chatRoutes.put("/rename",user_auth, renameGroup)

// Remove user from group
chatRoutes.put("/groupremove",user_auth, removeFromGroup)

//  Add user in group
chatRoutes.put("/groupadd",user_auth, addToGroup)

export default chatRoutes