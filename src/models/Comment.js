import mongoose from "mongoose";

const {Schema} = mongoose;

const commentSchema = new Schema({
    text: {type: String, required: true, },
    createdAt: {type: Date, required: true, default: Date.now},
    video: {type: mongoose.ObjectId, ref:"Video" },
    user: {type: mongoose.ObjectId, ref: "User"},
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;