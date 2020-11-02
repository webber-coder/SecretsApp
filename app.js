//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const secret = process.env.SECRET;

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",(req,res)=>{
    User.findOne({email: req.body.username,password: req.body.password},(err,result)=>{
        if(!err){
            if(result){
                res.render("secrets")
            }else{
                res.send("There is a problem with email or password")
            }
        }else{
            res.send(err);
        }
    })
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res) =>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err)=>{
        if(!err){
            res.render("secrets");
        }else{
            res.send(err);
        }
    });
})



app.listen(3000,()=>{
    console.log("Server is started on the port 3000");
})