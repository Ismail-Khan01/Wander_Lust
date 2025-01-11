const epxress = require('express');
const router = epxress.Router();
const listing = require("../models/listing")
const asyncWrap = require("../utils/asyncWrap.js");
const customError = require("../utils/error.js");
const { listingSchema, reviewSchema } = require("../schema.js");



const listingValidator = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",")
        throw new customError(400, errmsg)
    }
    else {
        next();
    }
}

// route to view all listings
router.get("/", asyncWrap(async (req, res) => {
    const Listings = await listing.find({});
    res.render("listings/allListings.ejs", { Listings });
}))

router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

router.post("/", listingValidator, asyncWrap(async (req, res) => {
    const { listing: list } = req.body
    const newListing = new listing(list);
    await newListing.save()
    req.flash("success", "New Listing got saved");
    res.redirect("/listings")
}))

// route to view individual listing
router.get("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id).populate("reviews")
    if (!list) {
        req.flash("failure", "Listing doesn't exist");
        res.redirect("/listings")
    }
    else {

        res.render("listings/list", { list });
    }
}))


// route to edit the listing
router.get("/:id/edit", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("failure", "Listing doesn't exist");
        res.redirect("/listings")
    }
    else {

        res.render("listings/edit.ejs", { list })
    }
}))

// route to update the listing
router.put("/:id", listingValidator, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { listing: list } = req.body;
    await listing.findByIdAndUpdate(id, { ...list }, { new: true, runValidators: true });
    req.flash("success", "Listing got updated")
    res.redirect(`/listings/${id}`)
}))

// delte route for deleting the listing
router.delete("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}))

module.exports = router