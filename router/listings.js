const epxress = require('express');
const router = epxress.Router();
const listing = require("../models/listing")
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, listingValidator } = require("../middleware.js");
const listingController = require("../controller/listings.js");

// route to view all listings and
//route for adding new listing 
router.route("/")
    .get("/", asyncWrap(listingController.index))
    .post("/", listingValidator, asyncWrap(listingController.addNewListing))


// route to get new Listing form
router.get("/new", isLoggedIn, listingController.newListingForm)



// route to view individual listing,
// route to update the listing and
// delte route for deleting the listing
router.route("/:id")
    .get("/:id", asyncWrap(listingController.showListing))
    .put("/:id", isLoggedIn, isOwner, listingValidator, asyncWrap(listingController.updateListing))
    .delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.destroyListing))


// route to edit the listing
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.showEditForm))

module.exports = router