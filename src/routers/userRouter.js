import express from "express";
import {
  getEdit,
  deleteUser,
  logOut,
  myProfile,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
  getChangePwd,
  postChangePwd,
} from "../controllers/userController";
import {
  protectorMiddelware,
  publicOnlyMiddleware,
  uploadAvatar,
} from "../middlewares/localmiddleware";

const userRouter = express.Router();

userRouter
  .route("/:id/edit")
  .all(protectorMiddelware)
  .get(getEdit)
  .post(uploadAvatar.single("avatar"), postEdit);
userRouter.get("/logout", protectorMiddelware, logOut);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", myProfile);
userRouter.route("/:id/change-password").get(getChangePwd).post(postChangePwd);
userRouter.get("/:id/delete", protectorMiddelware, deleteUser);

export default userRouter;
