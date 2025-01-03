const express = require('express');
const app = express();
const port = 8000

app.get("/", (req, res) => {
    console.log("the get request on / route")
    res.send("This is the root page")
})

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
})