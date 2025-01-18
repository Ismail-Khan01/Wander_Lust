const epxress = require('express');
const router = epxress.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, listingValidator } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer")
const { storage } = require("../cloudconfig.js")
const upload = multer({ storage })


// route to view all listings and
//route for adding new listing 
router.route("/")
    .get(asyncWrap(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), listingValidator, asyncWrap(listingController.addNewListing))


// route to get new Listing form
router.get("/new", isLoggedIn, listingController.newListingForm)



// route to view individual listing,
// route to update the listing and
// delte route for deleting the listing
router.route("/:id")
    .get(asyncWrap(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), listingValidator, asyncWrap(listingController.updateListing))
    .delete(isLoggedIn, isOwner, asyncWrap(listingController.destroyListing));


// route to edit the listing
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.showEditForm))
// rout for category
router.get("/category/:id", asyncWrap(listingController.category))

module.exports = router