import User from "../models/User";

export const getJoin = (req,res) => res.render("join", {pageTitle: "Create Account"});
export const postJoin = async (req,res) => {
    const {email, username, password, nickname} = req.body;
    const userExists = await User.exists({ $or: [ { email }, { username }, { nickname } ] });
    if(userExists){
        const errorMessage = "Username/email/nickname already exists. Try another one."
        return res.render("join", {pageTitle: "Create Account", errorMessage})
    }
    
    await User.create({
        email,
        username,
        password,
        nickname,
    })
    return res.redirect("/login")
}
export const login = (req,res) => res.render("login", {pageTitle: "Login"})
export const editUser = (req,res) => res.send("Edit user")
export const removeUser = (req,res) => res.send("Remove User?");
export const logOut = (req,res) => res.send("Your are logged out.")
export const seeUser = (req,res) => res.send("User info")