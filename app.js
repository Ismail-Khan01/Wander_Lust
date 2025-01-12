const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8000
const path = require("path")
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const customError = require("./utils/error.js");
const listingRouter = require('./router/listings.js');
const reviewRouter = require("./router/review.js")
const userRouter = require("./router/user.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require("./models/user.js");


app.use(methodoverride("_method"))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsmate);

const mongo_url = "mongodb://127.0.0.1:27017/wanderLust"
async function main() {
    await mongoose.connect(mongo_url);
}

// establishing connection with data base
main().then(() => {
    console.log("connection established with data base");
}).catch((err) => {
    console.log(err)
})
const sessionOpetions = {
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOpetions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(user.authenticate()))

passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.userStatus = req.user
    next()
})
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter)
app.use("/", userRouter)

// app.get("/demouser", async (req, res) => {
//     const user1 = new user({
//         email: "khlid@gmail.com",
//         username: "khalid"
//     })
//     const result = await user.register(user1, "ismail@12");
//     res.send(result)
// })


app.all("*", (req, res, next) => {
    throw new customError(404, "page not found")
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went Wrong" } = err;
    console.log(message, status);
    res.status(status).render("error.ejs", { message });
})

// root route
app.get("/", (req, res) => {
    console.log("the get request on / route")
    res.send("This is the root page")
})

// listening the app on port 8000
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
})