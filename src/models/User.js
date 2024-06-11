import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true,},
    username: {type: String, required: true, unique: true,},
    password: {type: String, unique: true,},
    nickname: {type:String, required: true},
    socialID: {type: Boolean},
    avatarUrl: String,
    videos: [{type:mongoose.Schema.Types.ObjectId, ref:"Video"}],
    comments: [{type:mongoose.ObjectId, ref: "Comment"}],
})

userSchema.pre("save", async function(){
    if(this.isModified("password"))
    {this.password = await bcrypt.hash(this.password, 5);}
})

const User = mongoose.model("User", userSchema)

export default User;