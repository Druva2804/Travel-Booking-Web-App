const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
if(error){
   let errMsg=error.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};


router.get("/",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});


//Create new listing
router.get("/new",async(req,res)=>{
    res.render("listings/new.ejs");
})


//show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!!!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//Add created listing to existing listings
router.post("/",
    validateListing,
    wrapAsync(async (req, res, next) => {
        console.log("Received form data:", req.body);  // for debugging
        let newListing = new Listing(req.body.listing); // ✅ Use nested object
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    })
);


//Edit Route
router.get("/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!!!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
});

//Update Route
router.put("/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    req.flash("success","Listed is Successfully Updated");
    res.redirect("/listings");
});

//Delete Route
router.delete("/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
});

module.exports= router;

