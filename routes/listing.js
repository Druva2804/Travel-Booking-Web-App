const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");




router.get("/",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});


//Create new listing
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});


//show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!!!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//Add created listing to existing listings
router.post("/",
    validateListing,
    wrapAsync(async (req, res, next) => {
        console.log("Received form data:", req.body);  // for debugging
        let newListing = new Listing(req.body.listing); // ✅ Use nested object
        console.log(req.user);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    })
);


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!!!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
});

//Update Route
router.put("/:id",isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listed is Successfully Updated");
    res.redirect("/listings");
});

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
});

module.exports= router;

