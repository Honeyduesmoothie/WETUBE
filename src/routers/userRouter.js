import express from "express";
import { getEdit, removeUser, logOut, seeUser, startGithubLogin, finishGithubLogin, postEdit } from "../controllers/userController";
import { protectorMiddelware, publicOnlyMiddleware } from "../middlewares/localmiddleware";

const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddelware).get(getEdit).post(postEdit)
userRouter.get("/logout",protectorMiddelware, logOut);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin)
userRouter.get("/delete", removeUser);
userRouter.get(":id", seeUser);

export default userRouter;
