const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

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

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68553a3c431c05a4788f7340"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();