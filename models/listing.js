const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"https://unsplash.com/photos/green-palm-trees-under-white-sky-during-daytime-I8uA8kG4O1g",
        set:(v)=>v===""?"https://unsplash.com/photos/green-palm-trees-under-white-sky-during-daytime-I8uA8kG4O1g" : v,
    },
    price:Number,
    location:String,
    country:String,
});


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;