import Video from "../models/video"
import User from "../models/User"
export const home = async (req,res) => {
        const videos = await Video.find({}).populate("owner").sort({createdAt: "desc"});
        return res.render("home", {pageTitle: "Home", videos})
    };
    

export const watchVideos = async (req,res) => {
    const {id } = req.params;
    const video = await Video.findById(id).populate("owner");
    if(video)
    { return res.render("watch", {pageTitle: video.title, video})
  } else {
    return res.render("404", {pageTitle: "Video not found."})
  }
}
export const editVideos = async (req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    const {user: {_id}} = req.session;
    if(String(video.owner) !== _id) {
        req.flash("error", "Only owners can edit the video.")
        return res.status(403).redirect("/")
    }
    if(!video){
        return res.render("404", {pageTitle: "Video not found."})
    }
    return res.render("editVideo", {pageTitle:`Edit: ${video.title}`, video})};

export const postEdit = async (req,res) => {
    const {id} = req.params;
    const {_id} = req.session.user;
    const {title, description, hashtags} = req.body;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."})
    }
    if(String(video.owner) !== _id) {
        req.flash("error", "Only owners can edit the video.")
        return res.status(403).redirect("/")
    }
   try { await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags)
    });
    req.flash("info", "Editing completed")
    return res.redirect(`/videos/${id}`);
} catch(error) {
        console.log(error)
        res.status(404).render("404")
    }
}

export const getUpload = (req,res) => {
    return res.render("upload", {pageTitle: "Upload a video"})
}

export const postUpload = async (req,res) => {
    const {
        body: {title, description, hashtags},
        files: {video, thumbnail},
        session: {user: {_id}},
            } = req;
    const videoUrl = video[0].path;
    const thumbnailUrl = thumbnail[0].path;
    try{
    const newVideo = await Video.create({
        videoUrl,
        thumbnailUrl,
        title,
        description,
        owner: _id,
        hashtags: Video.formatHashtags(hashtags),
    })
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("info", "Upload completed")
    return res.redirect("/");
} catch(error) {
    console.log(error)
    return res.status(400).render("upload", {pageTitle: "Upload a video", errorMessage: error._message})
}
}

export const deleteVideos = async (req,res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id)
    if(String(video.owner) !== _id) {
        return res.status(403).redirect("/")
    }
    await Video.deleteOne({_id:id});
    req.flash("info", "Deleting completed")
    return res.redirect("/");
}

export const searchVideos = async (req,res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {$regex: new RegExp(keyword, "i")},
        }).populate("owner")
    }
    // if no keyword, can't find any videos
    return res.render("search", {pageTitle: "Search", videos})
}

export const registerView = async (req,res)=>{
    const {id} = req.params; 
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}