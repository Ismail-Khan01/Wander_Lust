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

app.get("/list", async (req, res) => {
    const list2 = new list({
        title: " villa 2",
        description: "A place best for vocation",
        price: 20000,
        location: "Banglore",
        country: "India"
    })
    const response = await list2.save()
    console.log(response.title);
    res.send("received the request");
})

app.get("/", (req, res) => {
    console.log("the get request on / route")
    res.send("This is the root page")
})

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
})