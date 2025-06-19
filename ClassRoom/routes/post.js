const express=require("express");
const router=express.Router();

//Posts
//Index posts
router.get("/",(req,res)=>{
    res.send("GET for posts");
    
});

//Show posts
router.get("/:id",(req,res)=>{
    res.send("GET for show posts");
});

//POST-posts
router.post("/",(req,res)=>{
    res.send("POST for posts");
});


//DELETE-posts
router.delete("/",(req,res)=>{
    res.send("DELETE for post id");
});


module.exports=router;