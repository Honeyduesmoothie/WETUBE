import express from "express";
import { editUser, removeUser, logOut, seeUser, startGithubLogin, finishGithubLogin } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", editUser);
userRouter.get("/delete", removeUser);
userRouter.get("/logout", logOut);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin)
userRouter.get(":id", seeUser);

export default userRouter;
