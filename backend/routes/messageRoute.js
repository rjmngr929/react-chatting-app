import express from "express";
import {user_auth} from "../middleware/auth.js"
import {allMessages, sendMessage } from "../controller/messageController.js"


const messageRoutes = express.Router()

//  get specific chat data
messageRoutes.get("/:chatId",user_auth, allMessages)

//  send messages to users or group 
messageRoutes.post("/",user_auth, sendMessage)

export default messageRoutes