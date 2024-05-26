import express from "express"
import morgan from "morgan"
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import session from "express-session"
import MongoStore from "connect-mongo";
import { localMiddleware } from "./middlewares/localmiddleware";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // if true => save all the sessions from every visitor including who isn't logged in. => database waste
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    }),
}))
app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/uploads", express.static("uploads"))
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;



