import Video from "../models/video";
import User from "../models/User";
import Comment from "../models/Comment";
import fs from "fs";
import path from "path";
import session from "express-session";
export const home = async (req, res) => {
  const videos = await Video.find({})
    .populate("owner")
    .sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};

export const watchVideos = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: { path: "user" },
    });
  // Populating across multiple levels
  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  } else {
    return res.render("404", { pageTitle: "Video not found." });
  }
};

export const editVideos = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;
  if (String(video.owner) !== _id) {
    req.flash("error", "Only owners can edit the video.");
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("editVideo", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== _id) {
    req.flash("error", "Only owners can edit the video.");
    return res.status(403).redirect("/");
  }
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("info", "Editing completed");
    return res.redirect(`/videos/${id}`);
  } catch (error) {
    console.log(error);
    res.status(404).render("404");
  }
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload a video" });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    files: { video, thumbnail },
    session: {
      user: { _id },
    },
  } = req;
  const videoUrl = video[0].path;
  const thumbnailUrl = thumbnail[0].path;
  try {
    const newVideo = await Video.create({
      videoUrl,
      thumbnailUrl,
      title,
      description,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("info", "Upload completed");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload a video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideos = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (String(video.owner._id) !== _id) {
    req.flash("error", "Only the owner of the video can delete the video.");
    return res.status(403).redirect("/");
  }
  const userId = video.owner._id;
  const user = await User.findById(userId);

  user.videos.pull(id);
  await user.save();

  const comments = video.comments;
  for (const comment of comments) {
    const commentId = comment._id;
    await Comment.findByIdAndDelete(commentId);
  }

  await Video.deleteOne({ _id: id });
  // delete video from the upload folder.
  const videoPath = path.join(__dirname, "/../../", video.videoUrl);
  console.log(videoPath);
  fs.unlink(videoPath, (err) => {
    if (err) throw err;
    console.log("Video deleted");
  });
  // delete the thumbnail from the upload folder.
  const thumbPath = path.join(__dirname, "/../../", video.thumbnailUrl);
  fs.unlink(thumbPath, (err) => {
    if (err) throw err;
    console.log("Thumbnail deleted");
  });
  req.flash("info", "Deleting completed");
  return res.redirect("/");
};

export const searchVideos = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
    }).populate("owner");
  }
  // if no keyword, can't find any videos
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

// comments

export const saveComments = async (req, res) => {
  console.log(req.body);
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const comment = await Comment.create({
    text,
    video: id,
    user: user._id,
  });
  console.log(comment.id);
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.comments.push(comment.id);
  video.save();

  const commentOwner = await User.findById(user._id);
  commentOwner.comments.push(comment.id);
  commentOwner.save();

  return res.status(201).json({ user, commentId: comment.id });
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findByIdAndDelete(commentId)
    .populate("user")
    .populate("video");
  if (!comment) {
    return res.sendStatus(404);
  }
  const userId = comment.user._id;
  const user = await User.findById(userId);
  console.log(user.comments.length);
  user.comments.pull(commentId);
  console.log(user.comments.length);

  const videoId = comment.video._id;
  const video = await Video.findById(videoId);
  video.comments.pull(commentId);

  req.flash("info", "Comment deleted");
  return res.sendStatus(200);
};

export const editComment = async (req, res) => {
  const {
    params: { commentId },
    body: { text },
    session: { user },
  } = req;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.sendStatus(404);
  }
  comment.text = text;
  comment.save();
  return res.status(200).json({ user, commentId });
};

// likes

export const toggleLikes = async (req, res) => {
  const {
    params: { id: videoId },
    session: {
      user: { _id: userId },
    },
  } = req;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.sendStatus(404);
  }
  if (video.meta.likedUsers.includes(userId)) {
    video.meta.likedUsers.pull(userId);
    user.likedVideos.pull(videoId);
    video.meta.likes = video.meta.likes - 1;
  } else if (user.dislikedVideos.includes(videoId)) {
    user.dislikedVideos.pull(videoId);
    user.likedVideos.push(videoId);
    video.meta.likes = video.meta.likes + 2;
  } else {
    video.meta.likedUsers.push(userId);
    user.likedVideos.push(videoId);
    video.meta.likes = video.meta.likes + 1;
  }
  await video.save();
  await user.save();
  req.session.user = user;

  return res.status(200).json({ likes: video.meta.likes });
};

export const toggleDislikes = async (req, res) => {
  const {
    params: { id: videoId },
    session: {
      user: { _id: userId },
    },
  } = req;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.sendStatus(404);
  }
  if (video.meta.likedUsers.includes(userId)) {
    video.meta.likedUsers.pull(userId);
    user.likedVideos.pull(videoId);
    user.dislikedVideos.push(videoId);
    video.meta.likes = video.meta.likes - 2;
  } else if (user.dislikedVideos.includes(videoId)) {
    user.dislikedVideos.pull(videoId);
    video.meta.likes = video.meta.likes + 1;
  } else {
    user.dislikedVideos.push(videoId);
    video.meta.likes = video.meta.likes - 1;
  }
  await video.save();
  await user.save();
  req.session.user = user;
  return res.status(200).json({ likes: video.meta.likes });
};
