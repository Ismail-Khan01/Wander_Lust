const express = require('express');
const router = express.Router({ mergeParams: true })
const listing = require("../models/listing")
const reviews = require("../models/review.js")
const customError = require("../utils/error.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { reviewSchema } = require("../schema.js");
const { reviewValidator } = require("../middleware.js")


// route to add a review
router.post("/", reviewValidator, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    const Review = new reviews(req.body.review);
    list.reviews.push(Review);
    await list.save()
    await Review.save()
    req.flash("success", "New review got added");
    res.redirect(`/listings/${id}`)
}))
// delete route for review
router.delete("/:reviewid", asyncWrap(async (req, res) => {
    const { id, reviewid } = req.params;
    const list = await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    const review = await reviews.findByIdAndDelete(reviewid)
    req.flash("success", "Review got Deleted")
    res.redirect(`/listings/${id}`)

}))

module.exports = router