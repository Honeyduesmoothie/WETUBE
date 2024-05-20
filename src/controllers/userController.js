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
    })
    return res.redirect("/login")} catch(error) {
        console.log(error)
        return res.status(400).render("join", {pageTitle: "Create Account", errorMessage: error._message})
    }
}

export const login = (req,res) => res.render("login", {pageTitle: "Login"})

export const postLogin = async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username})
    const pageTitle =  "Login";
    if (!user) {
        return res.status(400).render("login", {pageTitle, errorMessage: "This account does not exists.",})
    }
    const pwdCheck = await bcrypt.compare(password, user.password);
    if (!pwdCheck) {
        return res.status(400).render("login", {pageTitle, errorMessage: "Password is wrong.",})
    }
    return res.redirect("/")
}

export const editUser = (req,res) => res.send("Edit user")
export const removeUser = (req,res) => res.send("Remove User?");
export const logOut = (req,res) => res.send("Your are logged out.")
export const seeUser = (req,res) => res.send("User info")