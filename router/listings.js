const epxress = require('express');
const router = epxress.Router();
const listing = require("../models/listing")
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, listingValidator } = require("../middleware.js");


// route to view all listings
router.get("/", asyncWrap(async (req, res) => {
    const Listings = await listing.find({});
    res.render("listings/allListings.ejs", { Listings });
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

router.post("/", listingValidator, asyncWrap(async (req, res) => {
    const { listing: list } = req.body
    const newListing = new listing(list);
    newListing.owner = req.user._id;
    await newListing.save()
    req.flash("success", "New Listing got saved");
    res.redirect("/listings")
}))

// route to view individual listing
router.get("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings")
    }
    else {

        res.render("listings/list", { list });
    }
}))


// route to edit the listing
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings")
    }
    else {
        res.render("listings/edit.ejs", { list })
    }
}))

// route to update the listing
router.put("/:id", isLoggedIn, isOwner, listingValidator, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { listing: list } = req.body;
    await listing.findByIdAndUpdate(id, { ...list }, { new: true, runValidators: true });
    req.flash("success", "Listing got updated")
    res.redirect(`/listings/${id}`)
}))

// delte route for deleting the listing
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(async (req, res) => {
    const { id } = req.params
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}))

module.exports = router