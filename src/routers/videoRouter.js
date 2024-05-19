import express from "express";
import { watchVideos, editVideos, deleteVideos, postEdit, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();



videoRouter.route("/upload").get(getUpload).post(postUpload)
videoRouter.route("/:id([0-9a-f]{24})").get(watchVideos);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(editVideos).post(postEdit)
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideos)


export default videoRouter;