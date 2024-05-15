let videos = [
    {
        name: "First video",
        duration: "50 min",
        ratings: 5,
        comments: 2,
        views: 43,
        id: 1,
    },
    {
        name: "Second video",
        duration: "50 min",
        ratings: 5,
        comments: 2,
        views: 43,
        id: 2,
    },
    {
        name: "Third video",
        duration: "50 min",
        ratings: 5,
        comments: 2,
        views: 43,
        id: 3,
    }
]

export const trending = (req,res) => res.render("home", {pageTitle : "Home", videos,});
export const watchVideos = (req,res) => {
    const {id } = req.params;
    const video = videos[id-1];
    return res.render("watch", {pageTitle: video.name, video})
}
export const editVideos = (req,res) => {
    const {id} = req.params;
    const video = videos[id-1];
    return res.render("edit", {pageTitle:`Edit ${video.name}`, video})};

export const postEdit = (req,res) => {
    const {id} = req.params;
    const {title} = req.body;
    const video = videos[id-1];
    video.name = title;
    return res.redirect(`/videos/${id}`)
}

export const getUpload = (req,res) => {
    return res.render("upload", {pageTitle: "Upload a video"})
}

export const postUpload = (req,res) => {
    const {title} = req.body;
    const newVideo = {
        name: title,
        duration: "50 min",
        ratings: 0,
        comments: 0,
        views: 0,
        id: videos.length + 1,
    }
    videos.push(newVideo);

    return res.redirect("/");
}

export const deleteVideos = (req,res) => res.render("delete", {pageTitle:"Delete"});
