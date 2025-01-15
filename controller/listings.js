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
    const { path: url, filename } = req.file
    const newListing = new listing(list);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
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
    let orignalImage = list.image.url
    orignalImage = orignalImage.replace("/upload", "/upload/w_600,q_10")
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings")
    }
    else {
        res.render("listings/edit.ejs", { list, orignalImage })
    }
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const list = await listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    if (typeof (req.file) != "undefined") {
        const { path: url, filename } = req.file
        list.image = { url, filename };
        await list.save()
    }
    req.flash("success", "Listing got updated")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}