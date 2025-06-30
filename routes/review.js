const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("../schema.js");
const  Review =require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {validateReview}= require("../middleware.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");


const reviewController=require("../controllers/review.js");
// const review=require("../models/reviews.js");

//Post Route
router.post("/", isLoggedIn,validateReview , wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destoryReview));


module.exports=router;