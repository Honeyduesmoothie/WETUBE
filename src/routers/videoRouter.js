import express from "express";
import { watchVideos, editVideos, deleteVideos, postEdit } from "../controllers/videoController";

const videoRouter = express.Router();




videoRouter.get("/:id", watchVideos)
videoRouter.get("/:id/edit", editVideos)
videoRouter.post("/:id/edit", postEdit)
videoRouter.get("/:id/delete", deleteVideos)


export default videoRouter;