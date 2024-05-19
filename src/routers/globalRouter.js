import express from "express"
import { home, searchVideos } from "../controllers/videoController";
import {handleJoin, handleLogin} from "../controllers/userController"

const globalRouter = express.Router();
globalRouter.get("/", home);
globalRouter.get("/join", handleJoin);
globalRouter.get("/login", handleLogin);
globalRouter.get("/search", searchVideos);


export default globalRouter;