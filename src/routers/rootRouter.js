import express from "express"
import { home, searchVideos } from "../controllers/videoController";
import {getJoin, login, postJoin, postLogin} from "../controllers/userController"

const rootRouter = express.Router();
rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(login).post(postLogin);
rootRouter.get("/search", searchVideos);


export default rootRouter;