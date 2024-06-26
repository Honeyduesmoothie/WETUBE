import User from "../models/User";
import Video from "../models/video";
import Comment from "../models/Comment";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Create Account" });
export const postJoin = async (req, res) => {
  const { email, username, password, password2, nickname } = req.body;
  if (password !== password2) {
    const errorMessage = "Password confirmation does not match.";
    return res
      .status(400)
      .render("join", { pageTitle: "Create Account", errorMessage });
  }
  const userExists = await User.exists({ username });
  if (userExists) {
    const errorMessage = "Username already exists. Try another one.";
    return res
      .status(400)
      .render("join", { pageTitle: "Create Account", errorMessage });
  }
  const nicknameExists = await User.exists({ nickname });
  if (nicknameExists) {
    const errorMessage = "Nickname already exists. Try another one.";
    return res
      .status(400)
      .render("join", { pageTitle: "Create Account", errorMessage });
  }
  const emailExists = await User.exists({ email });
  if (emailExists) {
    const errorMessage = "Email already exists. Try another one.";
    return res
      .status(400)
      .render("join", { pageTitle: "Create Account", errorMessage });
  }

  try {
    await User.create({
      email,
      username,
      password,
      nickname,
      socialID: false,
    });
    req.flash("info", "Your account has been successfully created");
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("join", {
      pageTitle: "Create Account",
      errorMessage: error._message,
    });
  }
};

export const login = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialID: false });

  const pageTitle = "Login";
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "This account does not exists.",
    });
  }
  const pwdCheck = await bcrypt.compare(password, user.password);
  if (!pwdCheck) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Password is wrong." });
  }
  //
  req.session.loggedIn = true;
  req.session.user = user;
  // session initialization (modification)
  // console.log(req.session)
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const baseURL = "https://github.com/login/oauth/authorize";
  return res.redirect(`${baseURL}?${params}`);
};

export const finishGithubLogin = async (req, res) => {
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  console.log(config.code);
  const params = new URLSearchParams(config).toString();
  const baseURL = "https://github.com/login/oauth/access_token";
  const finalURL = `${baseURL}?${params}`;
  const tokenData = await (
    await fetch(finalURL, {
      method: "post",
      headers: { Accept: "application/json" },
    })
  ).json();
  console.log(tokenData);
  const { access_token } = tokenData;
  if (access_token) {
    const apiURL = "https://api.github.com";
    const userData = await (
      await fetch(`${apiURL}/user`, {
        method: "get",
        headers: { Authorization: `Bearer ${access_token}` },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiURL}/user/emails`, {
        method: "get",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const email = emailData.find(
      (email) => email.primary === true && email.verified === true
    ).email;
    if (!email) {
      return res.redirect("/");
    }
    let user = await User.findOne({
      email,
    });
    if (!user) {
      user = await User.create({
        username: userData.login,
        email,
        password: "",
        nickname: userData.login,
        socialID: true,
      });
    } else {
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/");
  }
};

export const logOut = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("editUser", { pageTitle: "Edit profile.", user });
};
export const postEdit = async (req, res) => {
  const oriName = req.session.user.username;
  const oriEmail = req.session.user.email;
  const oriNickname = req.session.user.nickname;
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { username, email, nickname },
    file,
  } = req;
  const userExists = await User.exists({ username });
  if (oriName !== username && userExists) {
    const errorMessage = "Username already exists. Try another one.";
    return res
      .status(400)
      .render("editUser", { pageTitle: "Edit profile", errorMessage });
  }
  const nicknameExists = await User.exists({ nickname });
  if (oriNickname !== nickname && nicknameExists) {
    const errorMessage = "Nickname already exists. Try another one.";
    return res
      .status(400)
      .render("editUser", { pageTitle: "Edit profile", errorMessage });
  }
  const emailExists = await User.exists({ email });
  if (oriEmail !== email && emailExists) {
    const errorMessage = "Email already exists. Try another one.";
    return res
      .status(400)
      .render("editUser", { pageTitle: "Edit profile", errorMessage });
  }

  const user = await User.findByIdAndUpdate(
    { _id },
    {
      username,
      email,
      nickname,
      // avatarUrl: file ? file.path : avatarUrl,
      avatarUrl: file ? file.location : avatarUrl,
    },
    {
      new: true,
    }
  );
  if (avatarUrl !== user.avatarUrl) {
    const avatarPath = path.join(__dirname, "/../../", avatarUrl);
    fs.unlink(avatarPath, (err) => {
      if (err) throw err;
      console.log("The original avatar is deleted");
    });
  }
  req.session.user = user;
  req.flash("info", "Editing completed");
  res.redirect("/");
};

export const getChangePwd = (req, res) => {
  const { socialID } = req.session.user;
  if (socialID === true) {
    return res.status(400).redirect("/");
  }
  res.render("change-password", { pageTitle: "Change password" });
};
export const postChangePwd = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oriPwd, newPwd, newPwdConf },
  } = req;
  const pageTitle = "Change password";
  const pwdCheck = await bcrypt.compare(oriPwd, password);
  if (!pwdCheck) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "Password is wrong.",
    });
  }
  if (newPwd !== newPwdConf) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "New password confirmation does not match.",
    });
  }
  const user = await User.findById(_id);
  user.password = newPwd;
  user.save();
  req.session.user = user;
  req.flash("info", "Password changed");
  return res.redirect("/");
};

export const myProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "videos",
      populate: { path: "owner" },
    });
    if (!user) {
      return res.stauts(404).render("404", { pageTitle: "User not found." });
    }
    return res.render("profile", { pageTitle: user.username, user });
  } catch (error) {
    console.log(error);
    return res.status(404).render("404", { pageTitle: "Page not found." });
  }
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const loggedInUser = req.session.user;
  const user = await User.findById(id).populate("videos").populate("comments");
  if (loggedInUser._id !== user.id) {
    res.status(400).redirect("/");
  }
  // delete videos
  const videos = user.videos;

  for (const video of videos) {
    const videoId = video._id;
    await Video.findByIdAndDelete(videoId);
    const videoPath = path.join(__dirname, "/../../", video.videoUrl);
    fs.unlink(videoPath, (err) => {
      if (err) throw err;
      console.log("video deleted");
    });
  }
  //   delete comments
  const comments = user.comments;
  for (const comment of comments) {
    const commentId = comment._id;
    await Comment.findByIdAndDelete(commentId);
  }
  //   delete an avatar file.
  if (user.avatarUrl) {
    const avatarPath = path.join(__dirname, "/../../", user.avatarUrl);
    fs.unlink(avatarPath, (err) => {
      if (err) throw err;
      console.log("Avatar deleted");
    });
  }
  //   delete the user from database
  await User.findByIdAndDelete(id);
  req.flash("info", "Your account has deleted.");
  res.status(200).redirect("/");
};
