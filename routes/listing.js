const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");


const listingController=require("../controllers/listings.js");


const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//Index Route & Add listing to existing listing
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


//Create new listing
router.get("/new",isLoggedIn,listingController.renderNewForm);


//Show Route and Update Route and Delete
router.route("/:id")
.get(isLoggedIn,listingController.showListing)
.put(isLoggedIn,isOwner,listingController.updateListing)
.delete(isLoggedIn,isOwner,listingController.destroyListing);


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm);


module.exports= router;

