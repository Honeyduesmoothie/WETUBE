import express from "express";
import {
  registerView,
  saveComments,
  deleteComment,
  toggleLikes,
  toggleDislikes,
} from "../controllers/videoController";
import { protectorMiddelware } from "../middlewares/localMiddleware";

const apiRouter = express.Router();

apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/likes", protectorMiddelware, toggleLikes);
apiRouter.post("/videos/:id/dislikes", protectorMiddelware, toggleDislikes);
apiRouter.post("/videos/:id/comments", saveComments);
apiRouter.delete("/videos/:videoId/comments/delete/:commentId", deleteComment);

export default apiRouter;
