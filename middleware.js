const listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js")
const customError = require("./utils/error.js");

module.exports.listingValidator = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",")
        throw new customError(400, errmsg)
    }
    else {
        next();
    }
}
module.exports.reviewValidator = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",")
        throw new customError(400, errmsg)
    }
    else {
        next()
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("failure", "You must Login")
        return res.redirect("/login")
    }
    next()
}
module.exports.redirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list.owner.equals(res.locals.userStatus._id)) {
        req.flash("error", "You are not the owner of this Listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    console.log("reivew middlware")
    const { id, reviewid } = req.params;
    console.log(id, reviewid)
    const review = await Review.findById(reviewid);
    console.log(review)
    if (!review.author.equals(res.locals.userStatus._id)) {
        req.flash("error", "You are not the owner of this Review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}