import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    url: {type: String, required: true,},
    title: {type: String, required: true, trim: true, maxLength: 80},
    description: {type: String, required: true, trim: true, minLength: 10},
    createdAt: {type: Date, required: true, default: Date.now},
    owner: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    hashtags: {type: [{type: String}], required: true, trim: true},
    meta: {
        views: {type: Number, default: 0},
        rating: {type: Number, default: 0},
    },
 
})

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map(word => word.trim()).map(word=> word.startsWith("#") ? word : `#${word}`);
})

const Video = mongoose.model("Video", videoSchema);

export default Video;