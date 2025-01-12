const express = require("express")
const router = express.Router({ mergeParams: true })
const user = require("../models/user.js");
const passport = require("passport");



router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs")
})
router.post("/signup", async (req, res) => {
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
        req.flash("failure", e.message)
        res.redirect("/signup")
    }
})

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})
router.post("/login", passport.authenticate("local", { failureRedirect: "/signup", failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to wanderLust")
    res.redirect("/listings")

})
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You have successfully Logged out")
        res.redirect("/listings")
    })
})

module.exports = router