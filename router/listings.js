const epxress = require('express');
const router = epxress.Router();
const listing = require("../models/listing")
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, listingValidator } = require("../middleware.js");
const listingController = require("../controller/listings.js");


// route to view all listings
router.get("/", asyncWrap(listingController.index))

// route to get new Listing form
router.get("/new", isLoggedIn, listingController.newListingForm)

//route for adding new listing 
router.post("/", listingValidator, asyncWrap(listingController.addNewListing))

// route to view individual listing
router.get("/:id", asyncWrap(listingController.showListing))


// route to edit the listing
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.showEditForm))

// route to update the listing
router.put("/:id", isLoggedIn, isOwner, listingValidator, asyncWrap(listingController.updateListing))

// delte route for deleting the listing
router.delete("/:id", isLoggedIn, isOwner, asyncWrap(listingController.destroyListing))

module.exports = router