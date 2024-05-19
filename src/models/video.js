import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, maxLength: 80},
    description: {type: String, required: true, trim: true, minLength: 20},
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: {type: [{type: String}], required: true, trim: true},
    meta: {
        views: {type: Number, default: 0},
        rating: {type: Number, default: 0},
    },
 
})

videoSchema.pre("save", function(){
    return this.hashtags = this.hashtags[0]
        .split(",")
        .map(word => word.trim())
        .map(word => word.startsWith("#")? word : `#${word}`);
})

const Video = mongoose.model("Video", videoSchema);

export default Video;