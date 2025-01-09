const express = require('express');
const router = express.Router({ mergeParams: true })
const listing = require("../models/listing")
const review = require("../models/review.js")
const customError = require("../utils/error.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { reviewSchema } = require("../schema.js");


const reviewValidator = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",")
        throw new customError(400, errmsg)
    }
    else {
        next()
    }
}


// route to add a review
router.post("/", reviewValidator, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    const Review = new review(req.body.review);
    list.reviews.push(Review);
    await list.save()
    await Review.save()
    res.redirect(`/listings/${id}`)
}))
// delete route for review
router.delete("/:reviewid", asyncWrap(async (req, res) => {
    const { id, reviewid } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await review.findByIdAndDelete(reviewid)
    res.redirect(`/listings/${id}`)
}))

module.exports = router