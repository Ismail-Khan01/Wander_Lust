
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user)
    if (!req.isAuthenticated()) {
        req.flash("failure", "You must be Logged in to create listing")
        return res.redirect("/login")
    }
    next()
}