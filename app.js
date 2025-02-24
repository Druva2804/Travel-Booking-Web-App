const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");



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

app.get("/",(req,res)=>{
    res.send("Hi,I am on ");
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

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

app.listen(8080,()=>{
    console.log("Server is listening at port 8080");
});