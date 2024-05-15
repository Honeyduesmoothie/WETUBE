import express from "express"
import { trending } from "../controllers/videoController";
import {handleJoin, handleLogin} from "../controllers/userController"

const globalRouter = express.Router();
globalRouter.get("/", trending);
globalRouter.get("/join", handleJoin);
globalRouter.get("/login", handleLogin);


export default globalRouter;