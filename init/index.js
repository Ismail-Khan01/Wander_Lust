const mongoose = require('mongoose');
const initdata = require("./data");
const listing = require('../models/listing');

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");

}
main().then(() => {
    console.log("connected to data base")
}).catch((err) => {
    console.log(err)
})

async function initialize() {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);

}
initialize();