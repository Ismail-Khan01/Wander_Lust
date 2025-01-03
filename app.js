const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8000
const list = require("./models/listing")

const mongo_url = "mongodb://127.0.0.1:27017/wanderLust"
async function main() {
    await mongoose.connect(mongo_url);
}
main().then(() => {
    console.log("connection established with data base");
}).catch((err) => {
    console.log(err)
})

app.get("/list", (req, res) => {
    const list1 = new list({
        title: "ismail's villa",
        description: "A place best for vocation",
        price: 10000,
        location: "Banglore",
        country: "India"
    })
    res.send("received the request");
})

app.get("/", (req, res) => {
    console.log("the get request on / route")
    res.send("This is the root page")
})

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
})