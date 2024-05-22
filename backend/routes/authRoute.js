import express from "express";
import {register, login, profile,resetPassword,allUsers , searchUsers, updateUser, getUser} from "../controller/authController.js"
import {user_auth} from "../middleware/auth.js"
import multer from "multer"
import path from "path";
import fs from "fs"
import { exit } from "process";

// const upload = multer({ dest: './uploads' })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = './uploads'
      const exists = fs.existsSync(dir)

      if(!exists){
        fs.mkdirSync(dir)
      }

      cb(null, dir)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+".jpg")
    }
})

var upload = multer({ storage: storage })

const router = express.Router()

// register user
router.post("/register",register)

// login user
router.post("/login",login)

// get user data
router.get("/getuser", user_auth, getUser)

// update user
router.post("/updateUser",user_auth,updateUser)

// profile Update
router.post("/profile",user_auth ,upload.single('profile'), profile)

// reset passeord
router.post("/resetpassword",user_auth, resetPassword)

// get all user
router.post("/searchUser",user_auth, allUsers)

// get selected user
router.post("/searchUser/:query",user_auth, searchUsers)

export default router