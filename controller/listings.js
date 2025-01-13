const { model } = require("mongoose");
const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const Listings = await listing.find({});
    res.render("listings/allListings.ejs", { Listings });
}
module.exports.newListingForm = (req, res) => {
    res.render("listings/new.ejs");
}
module.exports.addNewListing = async (req, res) => {
    const { listing: list } = req.body
    const newListing = new listing(list);
    newListing.owner = req.user._id;
    await newListing.save()
    req.flash("success", "New Listing got saved");
    res.redirect("/listings")
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings")
    }
    else {

        res.render("listings/list", { list });
    }
}

module.exports.showEditForm = async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings")
    }
    else {
        res.render("listings/edit.ejs", { list })
    }
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { listing: list } = req.body;
    await listing.findByIdAndUpdate(id, { ...list }, { new: true, runValidators: true });
    req.flash("success", "Listing got updated")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}