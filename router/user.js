const express = require("express")
const router = express.Router({ mergeParams: true })

router.get("/signup", (req, res) => {
    res.render("/signup.ejs")
})

module.exports = router