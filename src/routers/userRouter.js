import express from "express";
import { editUser, removeUser, logOut, seeUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", editUser);
userRouter.get("/delete", removeUser);
userRouter.get("/logout", logOut);
userRouter.get(":id", seeUser);

export default userRouter;
