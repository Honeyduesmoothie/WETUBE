import express from "express";
import { watchVideos, editVideos, deleteVideos, postEdit, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();



videoRouter.route("/:id(\\d+)").get(watchVideos);
videoRouter.route("/:id(\\d+)/edit").get(editVideos).post(postEdit)
videoRouter.route("/upload").get(getUpload).post(postUpload)
videoRouter.get("/:id(\\d+)/delete", deleteVideos)


export default videoRouter;