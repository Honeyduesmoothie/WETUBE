import express from "express";
import {
  registerView,
  saveComments,
  deleteComment,
  toggleLikes,
  toggleDislikes,
  editComment,
} from "../controllers/videoController";
import { protectorMiddelware } from "../middlewares/localMiddleware";

const apiRouter = express.Router();

apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/likes", protectorMiddelware, toggleLikes);
apiRouter.post("/videos/:id/dislikes", protectorMiddelware, toggleDislikes);
apiRouter.post("/videos/:id/comments", saveComments);
apiRouter.delete("/videos/:videoId/comments/delete/:commentId", deleteComment);
apiRouter.post("/videos/:videoId/comments/edit/:commentId", editComment);

export default apiRouter;
