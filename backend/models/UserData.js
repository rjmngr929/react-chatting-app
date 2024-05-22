import mongoose from "mongoose"
// import bcrypt from "bcryptjs"
const { Schema } = mongoose;

const userSchema = new Schema({
    name : {
        type: String,
        min : 6,
        max : 255
    },
    email : {
        type : String,
        max: 255,
        min : 6
    },
    mobile : {
        type : String,
        max: 255,
        min : 6
    },
    profile : {
        type : String,
        // default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
    },
    password : {
        type : String,
        max: 255,
        min : 6
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
    token : {
        type: String,
    }
},
{
    timestamps: true
}
);

// userSchema.pre("save", async (next) => {
//     if(!this.modified){
//         next();
//     }

//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt);
// });

export default mongoose.model("MyUser", userSchema)

