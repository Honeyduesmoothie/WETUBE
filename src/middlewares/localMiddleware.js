import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3AvatarStorage = multerS3({
  s3: s3Client,
  bucket: "wetube-clone-honeyduesmoothie",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `avatars/${req.session.user._id}/${Date.now().toString()}`);
  },
});

const s3VideoStorage = multerS3({
  s3: s3Client,
  bucket: "wetube-clone-honeyduesmoothie",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `videos/${req.session.user._id}/${Date.now().toString()}`);
  },
});

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
  limits: {
    fileSize: 10000000,
  },
  storage: s3AvatarStorage,
});
export const uploadVideo = multer({
  limits: {
    fileSize: 100000000,
  },
  storage: s3VideoStorage,
});
