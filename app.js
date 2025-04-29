const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAysnc=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");



async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/BookingWebApp');
}

main()
.then(()=>{
    console.log("Connected to DB");
    
})
.catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("Hi,I am on ");
});


const validateListing=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
if(result.error){
   let errMsg=error.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};
// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1000,
//         location:"Somewhere in India",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });

app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});


//Create new listing
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs");
})


//show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Add created listing to existing listings
app.post("/listings",
    validateListing,
    wrapAysnc(async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let newListing = new Listing({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        country: req.body.country,
        location: req.body.location
    });
    // if(!newListing.title){
    //     throw new ExpressError(400,"Title is misssing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"description is misssing");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400,"location is misssing");
    // }
    await newListing.save();
    res.redirect("/listings"); // make sure to include the slash
}));

//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect("/listings");
});

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.render("error.ejs",{message});

});

app.listen(8080,()=>{
    console.log("Server is listening at port 8080");
});