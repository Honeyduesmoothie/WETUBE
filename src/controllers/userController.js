import User from "../models/User";
import bcrypt from "bcrypt"



export const getJoin = (req,res) => res.render("join", {pageTitle: "Create Account"});
export const postJoin = async (req,res) => {
    const {email, username, password, password2, nickname} = req.body;
    if (password !== password2) {
        const errorMessage = "Password confirmation does not match."
        return res.status(400).render("join", {pageTitle: "Create Account", errorMessage})
    }
    const userExists = await User.exists({username});
    if(userExists){
        const errorMessage = "Username already exists. Try another one."
        return res.status(400).render("join", {pageTitle: "Create Account", errorMessage})
    }
    const nicknameExists = await User.exists({nickname});
    if(nicknameExists){
        const errorMessage = "Nickname already exists. Try another one."
        return res.status(400).render("join", {pageTitle: "Create Account", errorMessage})
    }
    try {await User.create({
        email,
        username,
        password,
        nickname,
        socialID: false,
    })
    return res.redirect("/login")} catch(error) {
        console.log(error)
        return res.status(400).render("join", {pageTitle: "Create Account", errorMessage: error._message})
    }
}

export const login = (req,res) => res.render("login", {pageTitle: "Login"})

export const postLogin = async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, socialID: false})

    const pageTitle =  "Login";
    if (!user) {
        return res.status(400).render("login", {pageTitle, errorMessage: "This account does not exists.",})
    }
    const pwdCheck = await bcrypt.compare(password, user.password);
    if (!pwdCheck) {
        return res.status(400).render("login", {pageTitle, errorMessage: "Password is wrong.",})
    }
    // 
    req.session.loggedIn = true;
    req.session.user = user;
    // session initialization (modification)
    console.log(req.session)
    return res.redirect("/")
}

export const startGithubLogin = (req,res) => {
    const config = {
        client_id: process.env.GH_CLIENT,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    console.log(params)
    const baseURL = "https://github.com/login/oauth/authorize"
    return res.redirect(`${baseURL}?${params}`)
}

export const finishGithubLogin = async (req,res) => {
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const baseURL = "https://github.com/login/oauth/access_token"
    const finalURL = `${baseURL}?${params}`;
    const tokenData = await (await fetch(finalURL, {
        method: "post",
        headers: 
        {Accept: "application/json"},
    })).json();
    console.log(tokenData)
    const {access_token} = tokenData;
    if(access_token){ 
        const apiURL = "https://api.github.com"
        const userData = await (await fetch(`${apiURL}/user`, {
            method: "get",
            headers:
            {Authorization: `Bearer ${access_token}`}
        })).json();
        console.log(userData)
        
        const emailData = await (await fetch(`${apiURL}/user/emails`, {
            method: "get",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${access_token}`
            }
        })).json();
        console.log(emailData)
        const email = emailData.find(email => email.primary === true && email.verified === true).email;
        if(!email) {
            return res.redirect("/");
        }
        let user = await User.findOne({
            email,
        })
        if (!user) {
             user = await User.create({
                username: userData.login,
                email,
                password: "",
                nickname: userData.login,
                socialID: true,})
        } else {
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
            }
            
    } else {
        return res.redirect("/")
    }
}

export const logOut = (req,res) => {
    req.session.destroy();
    res.redirect("/")
}

export const getEdit = (req,res) => res.render("editUser", {pageTitle: "Edit profile."})
export const postEdit = async (req,res) => {
    const oriName = req.session.user.username;
    const oriEmail = req.session.user.email;
    const oriNickname = req.session.user.nickname;
    const {
        session: {user: {_id}},
        body: {username, email, nickname},
    } = req;
    const userExists = await User.exists({username});
    if(oriName !== username && userExists){
        const errorMessage = "Username already exists. Try another one."
        return res.status(400).render("editUser", {pageTitle: "Edit profile", errorMessage})
    }
    const nicknameExists = await User.exists({nickname});
    if(oriNickname !== nickname && nicknameExists){
        const errorMessage = "Nickname already exists. Try another one."
        return res.status(400).render("editUser", {pageTitle: "Edit profile", errorMessage})
    }
    const emailExists = await User.exists({email})
    if(oriEmail !== email && emailExists){
        const errorMessage = "Email already exists. Try another one."
        return res.status(400).render("editUser", {pageTitle: "Edit profile", errorMessage})
    }
   
    const user = await User.findByIdAndUpdate({_id}, {
        username,
        email, 
        nickname,
    }, {
        new: true
    });
    req.session.user = user;
    res.redirect("/")
}
export const removeUser = (req,res) => res.send("Remove User?");
export const seeUser = (req,res) => res.send("User info")