const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review= require("./reviews.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image: {
  type: String,
  default: function () {
    const keywords = ["cottage", "villa", "nature", "house", "resort"];
    const random = keywords[Math.floor(Math.random() * keywords.length)];
    return `https://source.unsplash.com/random/800x600/?${random}`;
  },
  set: function (value) {
    return value === "" ? undefined : value;
  }
},


    price:Number,
    location:String,
    country:String,
    reviews:[
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        },

    ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }

});


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;