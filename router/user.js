const express = require("express")
const router = express.Router({ mergeParams: true })
const passport = require("passport");
const { redirect } = require("../middleware.js");
const userController = require("../controller/user.js");
const asyncWrap = require("../utils/asyncWrap.js");


// route to render signup form and
// route for user signup 
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signup)

// route to render login form and
// route for user login
router.route("/login")
    .get(userController.renderLoginForm)
    .post(redirect, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), asyncWrap(userController.login))

// route for user logout
router.get("/logout", userController.logout)

module.exports = router