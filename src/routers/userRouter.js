import express from "express";
import { getEdit, removeUser, logOut, seeUser, startGithubLogin, finishGithubLogin, postEdit, getChangePwd, postChangePwd } from "../controllers/userController";
import { protectorMiddelware, publicOnlyMiddleware } from "../middlewares/localmiddleware";

const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddelware).get(getEdit).post(postEdit)
userRouter.get("/logout",protectorMiddelware, logOut);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin)
userRouter.route("/change-password").get(getChangePwd).post(postChangePwd)
userRouter.get("/delete", removeUser);
userRouter.get(":id", seeUser);

export default userRouter;
