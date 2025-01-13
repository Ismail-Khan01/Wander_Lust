const listing = require("./models/listing")
const { listingSchema, reviewSchema } = require("./schema.js")
const customError = require("../utils/error.js");

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
        req.flash("failure", "You must be Logged in to create listing")
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
    if (res.locals.userStatus && res.locals.userStatus._id.equals(list.owner._id)) {
        return next()
    }
    req.flash("error", "You are not the owner of this Listing")
    res.redirect(`/listings/${id}`)
}