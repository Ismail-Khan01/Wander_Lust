const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8000
const path = require("path")
const listing = require("./models/listing")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

const mongo_url = "mongodb://127.0.0.1:27017/wanderLust"
async function main() {
    await mongoose.connect(mongo_url);
}
main().then(() => {
    console.log("connection established with data base");
}).catch((err) => {
    console.log(err)
})

app.get("/listings", async (req, res) => {
    const Listings = await listing.find({});
    res.render("allListings.ejs", { Listings });
})


app.get("/", (req, res) => {
    console.log("the get request on / route")
    res.send("This is the root page")
})

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
})