const express = require("express")
const router = express.Router({ mergeParams: true })
const user = require("../models/user.js");
const passport = require("passport");
const { redirect } = require("../middleware.js");
const userController = require("../controller/user.js");


// route to render signup form and
// route for user signup 
router.route("/signup")
    .get("/signup", userController.renderSignupForm)
    .post("/signup", userController.signup)

// route to render login form and
// route for user login
router.route("/login")
    .get("/login", userController.renderLoginForm)
    .post("/login", redirect, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login)

// route for user logout
router.get("/logout", userController.logout)

module.exports = router