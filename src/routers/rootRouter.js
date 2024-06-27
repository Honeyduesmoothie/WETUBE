import express from "express";
import { home, searchVideos } from "../controllers/videoController";
import {
  getJoin,
  login,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { publicOnlyMiddleware } from "../middlewares/localMiddleware";

const rootRouter = express.Router();
rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(login).post(postLogin);
rootRouter.get("/search", searchVideos);

export default rootRouter;
