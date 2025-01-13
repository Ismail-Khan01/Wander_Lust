const express = require('express');
const router = express.Router({ mergeParams: true })
const listing = require("../models/listing")
const reviews = require("../models/review.js")
const asyncWrap = require("../utils/asyncWrap.js");
const { reviewValidator, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controller/review.js");


// route to add a review
router.post("/", isLoggedIn, reviewValidator, asyncWrap(reviewController.newReview))
// delete route for review
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, asyncWrap(reviewController.destroyReview))

module.exports = router