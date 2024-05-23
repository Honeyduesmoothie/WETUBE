export const localMiddleware = (req,res,next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.user = req.session.user || {};
    console.log(res.locals)
    next();
}

export const protectorMiddelware = (req,res,next) => {
    if(req.session.loggedIn) {
        next();
    } else {
       return res.redirect("/login")
    }
}

export const publicOnlyMiddleware = (req,res,next) => {
    if(req.session.loggedIn) {
        return res.redirect("/")
    } else {
        next();
    }
}