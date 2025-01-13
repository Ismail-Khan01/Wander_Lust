const user = require("../models/user.js")
module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs")
}
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new user({ username, email })
        const registeredUser = await user.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "User Succesfully registered")
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to wanderLust")
    const redirecturl = res.locals.redirect || "/listings";
    res.redirect(redirecturl)

}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You have successfully Logged out")
        res.redirect("/listings")
    })
}