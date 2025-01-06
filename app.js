const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8000
const path = require("path")
const listing = require("./models/listing")
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const customError = require("./utils/error.js");
const asyncWrap = require("./utils/asyncWrap.js");


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

// route to view all listings
app.get("/listings", asyncWrap(async (req, res) => {
    const Listings = await listing.find({});
    res.render("listings/allListings.ejs", { Listings });
}))

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings", asyncWrap(async (req, res) => {
    const { listing: list } = req.body
    if (!list) {
        throw new customError(400, "provide the listing data")
    }
    const newListing = new listing(list);
    await newListing.save()
    res.redirect("/listings")
}))

// route to view individual listing
app.get("/listings/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    res.render("listings/list", { list });
}))

// route to edit the listing
app.get("/listings/:id/edit", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    res.render("listings/edit.ejs", { list })
}))

// route to update the listing
app.put("/listings/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { listing: list } = req.body;
    if (!list) {
        throw new customError(400, "Provide listing data")
    }
    await listing.findByIdAndUpdate(id, { ...list }, { new: true, runValidators: true });
    res.redirect(`/listings/${id}`)
}))

app.delete("/listings/:id", asyncWrap(async (req, res) => {
    const { id } = req.params
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))
app.all("*", (req, res, next) => {
    throw new customError(404, "page not found")
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went Wrong" } = err;
    console.log(message, status);
    res.status(status).send(message);
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