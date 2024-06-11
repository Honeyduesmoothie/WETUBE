import express from "express";
import {
  registerView,
  saveComments,
  deleteComment,
  saveLikes,
  saveDislikes,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/likes", saveLikes);
apiRouter.post("/videos/:id/dislikes", saveDislikes);
apiRouter.post("/videos/:id/comments", saveComments);
apiRouter.delete("/videos/:videoId/comments/delete/:commentId", deleteComment);

export default apiRouter;
