// Variables
var titles = [];
var descs = [];


// Server

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", (req, res)=>{
    res.render("index", {ejs_title:titles, ejs_desc:descs});
})

app.post("/", (req, res)=>{
    let heading = req.body.title;
    let description = req.body.desc;
    let card_check = req.body.check;
    let remove = req.body.clear;

    if(remove==="clearall"){
        titles = [];
        descs = [];
    }

    if(heading){
        titles.push(heading.slice(0, 30));
        descs.push(description.slice(0, 150));
    }    

    if(card_check){
        console.log("I am dead");
    }

    console.log(card_check);  
    res.redirect("/");
})



app.listen(3000, ()=>{
    "listening to port 3000"
})