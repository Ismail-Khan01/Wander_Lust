const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8000
const path = require("path")
const listing = require("./models/listing")
const methodoverride = require("method-override");

app.use(methodoverride("_method"))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

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
app.get("/listings", async (req, res) => {
    const Listings = await listing.find({});
    res.render("listings/allListings.ejs", { Listings });
})

// route to view individual listing
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    res.render("listings/list", { list });
})

// route to edit the listing
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    res.render("listings/edit.ejs", { list })
})

// route to update the listing
app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const { listing: list } = req.body;
    const response = await listing.findByIdAndUpdate(id, { ...list }, { new: true, runValidators: true });
    console.log("response", response);
    res.redirect(`/listings/${id}`)
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