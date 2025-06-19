const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);
    console.log(registeredUser);
    req.flash("success","Welocome to travelNstay");
    res.redirect("/listings");
    }
    catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");

    }
    
});


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
async(req,res)=>{
    res.send("Welcome to travelNstay! you are logged in");

});

module.exports=router;