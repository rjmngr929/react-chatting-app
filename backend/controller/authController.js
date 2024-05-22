import MyUser from "../models/UserData.js";
import fs from "fs"
import jwt from "jsonwebtoken";
import bcrypt  from "bcryptjs";
// const multer  = require('multer')



export const register = async (req, res) => {

    // print("Enter register function")
    const mobileExist = await MyUser.findOne({mobile : req.body.mobile});
    const emailExist = await MyUser.findOne({email : req.body.email});

    var salt = bcrypt.genSaltSync(10);

    const name = req.body.name
    const email = req.body.email
    const mobile = req.body.mobile
    const password = bcrypt.hashSync(req.body.password, salt);

    // var payload = {
    //     name,
    //     email,
    //     mobile
    // };

    // // PRIVATE and PUBLIC key
    // var privateKEY = fs.readFileSync(
    //     "./Private.pem",
    //     "utf8"
    // );

    // //SIGNING OPTION

    // var signOptions = {
    //     algorithm: "RS256"
    // };

    // var token = jwt.sign(
    //     payload,
    //     { key: privateKEY, passphrase: "aggregate-solution4321" },
    //     signOptions
    // );
  
    const userData = new MyUser({
        name : name,
        email : email,
        mobile : mobile,
        password : password
    })
     
     if(mobileExist){
        res.status(400).send({status : false, message : "Mobile number already registered!!.."})
     }
     else if(emailExist){
        res.status(400).send({status : false, message : "Email already registered!!.."})
     }
     else{
        // console.log(userData);
         userData.save().then((data)=>{
             res.status(200).send({status : true, message : "User register success!!..", data : data })
         }).catch((err) => {
             res.status(400).send({status : false, message : err})
         })
     }
     
}

export const getUser = async (req, res) => {
    try {
        const userData = await MyUser.findOne({_id : req.user._id});
        if(userData){
            res.status(200).send({status: true, message: "data fetch success!", data: userData})
        }
        else{
            res.status(400).send({status: false, message: "data fetch failed!"})
        }
    } catch (error) {
        res.status(400).send({status: false, message: error})
    }
}

export const updateUser = async (req,res) => {
    
    const updateUser = await MyUser.findOneAndUpdate( {_id : req.user._id} , {name : req.body.name} );
    if(updateUser){
        res.status(200).send({status : true, message : "User update success!", data: updateUser})
    }
    else{
        res.status(400).send({status : false, message : "User update failed!"})
    }
    
   
}

export const login = async (req, res) => {
    console.log("user credential => "+req.body);
    const emailExist = await MyUser.findOne({email : req.body.email});
    if(emailExist){

        const checkPassword = bcrypt.compareSync(req.body.password, emailExist.password);
        console.log("user credential => "+checkPassword);
        if(checkPassword){
            var payload = {
                user_id: emailExist._id,
                user_email: emailExist.email
            };
    
            // PRIVATE and PUBLIC key
            var privateKEY = fs.readFileSync(
                "./Private.pem",
                "utf8"
            );
    
            //SIGNING OPTION
    
            var signOptions = {
                algorithm: "RS256"
            };
    
            var token = jwt.sign(
                payload,
                { key: privateKEY, passphrase: "aggregate-solution4321" },
                signOptions
            );

            await MyUser.findOneAndUpdate( {_id : emailExist._id} , {token : token} );
           
            res.status(200).send({status : true, message : "Login Success!!..", data : emailExist, token : token})
        }else{
            res.status(400).send({status : false, message : "Invalid credientials" })
        }

    }else{
        res.status(404).send({status : false, message : "User not exists"})
    }
    
}

export const profile = async (req, res) => {

    // console.log(req.file);
    const userDetail = await MyUser.findOne({_id : req.user._id})
    // console.warn(userDetail);
    if(userDetail != null){
        if(userDetail.profile != null){
                fs.unlinkSync(userDetail.profile)
            }
        var profileImg = "uploads/"+req.file.filename
    //  console.log(req.file);
        const profileExist = await MyUser.findOneAndUpdate( {_id : req.user._id} , {profile : profileImg} );
        profileExist.profile = profileImg
        res.status(200).send({status : true, message : "Profile update success!", data: profileExist})
    }
    else{
        res.status(400).send({status : false, message: "Invalid user!"})
    }


}

export const resetPassword = async (req, res) => {

    var password = req.body.password;
    var Cpassword = req.body.cPassword;

    if(password === Cpassword){
        var salt = bcrypt.genSaltSync(10);
        var changePassword = bcrypt.hashSync(password, salt)

        try{
            var passwordStatus = await MyUser.findOneAndUpdate({_id : req.user._id}, {password : changePassword})

            if(passwordStatus){
                res.status(200).send({status : true, message : "password update success!!.."})
            }else{
                res.status(400).send({status : false, message : "password update failed!!.."})
            }

        }catch(err){
            res.status(400).send({status : false, message : err})
        }

    }
    else{
        res.status(400).send({status : false, message : "Password Mismatched"})
    }

    
}

export const searchUsers = async (req, res) => {

        const keyword = req.params.query
        ? {
            $or: [
              { name: { $regex: req.params.query, $options: "i" } },
              { email: { $regex: req.params.query, $options: "i" } },
            ],
          }
        : {};

        // console.log(req.user);
    
      const users = await MyUser.find(keyword).find({ _id: { $ne: req.user._id } });
        res.status(200).send({status : true, message : "data fetch success!" ,data : users});
      
    
  };

export const allUsers = async (req, res) => {

// console.log("search query value is "+req.params.query);

try{
    const users = await MyUser.find({ _id: { $ne: req.body._id } });
    res.status(200).send({status : true, message : "data fetch success!" ,data : users});
}catch(err){
    res.status(400).send({status : false, message : err});
}

// if(req.params.query){
//     const keyword = req.params.query
//     ? {
//         $or: [
//           { name: { $regex: req.params.query, $options: "i" } },
//           { email: { $regex: req.params.query, $options: "i" } },
//         ],
//       }
//     : res.status(400).send({status : false, message: "No user found!"});


//   const users = await MyUser.find(keyword).find({ _id: { $ne: req.body._id } });
//   res.status(200).send({status : true, message : "data fetch success!" ,data : users});
// }else{
//     res.status(400).send({status : false, message: "Please enter valid name or email"})
// }

};

  


