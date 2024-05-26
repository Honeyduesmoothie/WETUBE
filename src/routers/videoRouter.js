import express from "express";
import { watchVideos, editVideos, deleteVideos, postEdit, getUpload, postUpload } from "../controllers/videoController";
import { protectorMiddelware, uploadVideo } from "../middlewares/localmiddleware";

const videoRouter = express.Router();



videoRouter.route("/upload").all(protectorMiddelware).get(getUpload).post(uploadVideo.single("video"), postUpload);
videoRouter.route("/:id([0-9a-f]{24})").all(protectorMiddelware).get(watchVideos);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(editVideos).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete",protectorMiddelware, deleteVideos);


export default videoRouter;