const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.use(cookieParser("secretcode"));

app.set*("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={
     secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};

app.use( session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("successs");
    res.locals.errorMsg=req.flash("error");
    next();
});


app.get("/register",(req,res)=>{
    let {name="Unknown"}=req.query;
    req.session.name=name;
    if(name==="unknown"){
        req.flash("error","uses registered successfully");
    }else{
        req.flash("success","user registered successfully!!!");
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
});

// app.get("/getCookies",(req,res)=>{
//     // res.cookie("greet","hello");
//     // res.send("Cookie's is sent");
//     let {name="unknown"}=req.cookies;
//     res.send(`Hi ${name}`);
// });

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie send");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I am root!");
// });

// app.use("/users",users);
// app.use("/posts",posts);

app.get("/test",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You sent a request ${req.session.count} times`);
});


app.listen(3000,()=>{
    console.log("server is listening to 3000");
});