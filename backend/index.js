import express from "express"
import userRoutes from "./routes/authRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import mongoose from "mongoose";
import MyUser from "./models/UserData.js";
import cors from "cors"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express()
const PORT = process.env.PORT || 4000

import http from 'http'
const server = http.createServer(app);
// const { Server } = require("socket.io");
import {Server} from 'socket.io' 
// const io = new Server(server)
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: ["http://localhost:3000", "http://192.168.1.162:3000"],
      credentials: true,
    },
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from "dotenv";

dotenv.config();

app.use(express.json())

app.use(cors())

const uri = "mongodb+srv://chat:chat@user.u7fhy.mongodb.net/ChatSite?retryWrites=true&w=majority";
mongoose.connect(uri).then(() => {
    console.log("Connection SuccessFully..")
}).catch(()=>{
    console.log("Connection Failed..");
})


app.use(express.static(__dirname + '/uploads'));

app.use('/uploads', express.static('uploads'));

app.get("/", (req,res) => {
    res.send("server run succes!!..")
})

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)


// *****************************Socket Api*******************************************
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
    //   console.log(newMessageRecieved);
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });


server.listen(PORT, ()=>{
    console.log("server is running from port "+PORT);
})