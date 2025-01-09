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




app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter)




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