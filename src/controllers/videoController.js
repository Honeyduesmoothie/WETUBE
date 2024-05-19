import Video from "../models/video"
export const home = async (req,res) => {
        const videos = await Video.find({});
        return res.render("home", {pageTitle: "Home", videos})
    };
    

export const watchVideos = async (req,res) => {
    const {id } = req.params;
    const video = await Video.findById(id);
    if(video)
    { return res.render("watch", {pageTitle: video.title, video})
  } else {
    return res.render("404", {pageTitle: "Video not found."})
  }
}
export const editVideos = async (req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.render("404", {pageTitle: "Video not found."})
    }
    return res.render("edit", {pageTitle:`Edit: ${video.title}`, video})};

export const postEdit = async (req,res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id:id});
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."})
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags)
    })
    return res.redirect(`/videos/${id}`)
}

export const getUpload = (req,res) => {
    return res.render("upload", {pageTitle: "Upload a video"})
}

export const postUpload = async (req,res) => {
    const {title, description, hashtags} = req.body;
    try{
    await Video.create({
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect("/");
} catch(error) {
    console.log(error)
    return res.render("upload", {pageTitle: "Upload a video", errorMessage: error._message})
}
}

export const deleteVideos = async (req,res) => {
    const {id} = req.params;
    await Video.deleteOne({_id:id});
    return res.redirect("/");
}
