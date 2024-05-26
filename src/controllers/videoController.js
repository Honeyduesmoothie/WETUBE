import Video from "../models/video"
import User from "../models/User"
export const home = async (req,res) => {
        const videos = await Video.find({}).sort({createdAt: "desc"});
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
    console.log(video)
    if(String(video.owner) !== _id) {
        return res.status(403).redirect("/")
    }
   try { await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags)
    });
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
        file: {path:url},
        session: {user: {_id}},
            } = req;
    try{
    const newVideo = await Video.create({
        url,
        title,
        description,
        owner: _id,
        hashtags: Video.formatHashtags(hashtags),
    })
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
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
    return res.redirect("/");
}

export const searchVideos = async (req,res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {$regex: new RegExp(keyword, "i")},
        })
    }
    // if no keyword, can't find any videos
    return res.render("search", {pageTitle: "Search", videos})
}