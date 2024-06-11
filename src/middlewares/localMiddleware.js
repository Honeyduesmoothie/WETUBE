import multer from "multer";

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddelware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Please log in first");
    return res.status(401).redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    req.flash("error", "You are already logged in");
    return res.redirect("/");
  } else {
    next();
  }
};

export const uploadAvatar = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 10000000,
  },
});
export const uploadVideo = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 100000000,
  },
});
