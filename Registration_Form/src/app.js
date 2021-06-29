require('dotenv').config()
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
require("./database/conn");

const Register = require("./models/register");
const {json} = require("express");
const port = process.env.port || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.get("/", (req,res)=>{
    res.render("index")
});

app.get("/secret", auth, (req,res)=>{
   // console.log(`this is my secret page cookie ${req.cookies.jwt}`);
    res.render("secret")
});

app.get("/register", (req,res)=>{
    res.render("register")
});

app.get("/login", (req,res)=>{
    res.render("login")
});

app.post("/register", async(req,res)=>{
    try{
       const password = req.body.password;
       const cpassword = req.body.confirmpassword;
       if(password === cpassword)
       {
        const registerEmployee = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            gender:req.body.gender,
            phone:req.body.phone,
            age:req.body.age,
            password:password,
            confirmpassword:cpassword
           })

           const token = await registerEmployee.generateAutoToken();
           res.cookie("jwt", token, {
               expires : new Date(Date.now() + 30000),
               httpOnly : true
           });

           const registered = await registerEmployee.save();
           res.status(201).render("index");
       }
       else
       {
           res.send("password error");
       }
    }catch(error){
        res.status(400).send(error);
    }
});

//login check

app.post("/login", async(req,res)=>{
   try{
    const email = req.body.email;
    const password = req.body.password;

    const useremail  = await Register.findOne({email:email});

    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await registerEmployee.generateAutoToken();
    res.cookie("jwt", token, {
        expires : new Date(Date.now() + 60000),
        httpOnly : true,
        // secure : true
        });

    if(isMatch)
    {
        res.status(201).render("index")
    }else{
        res.send("Invalid")
    }

   }catch(error){
       res.status(400).send("Invalid login details Catch block");
   }
});

app.listen(port,() =>{
    console.log(`connection is live at port ${port}`);
})