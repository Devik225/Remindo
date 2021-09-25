// Variables
var titles = [];
var descs = [];


// Server

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Remindo");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const cardSchema = new mongoose.Schema({
    Title:String,
    Description:String
});

const card = mongoose.model("card", cardSchema);


app.get("/", (req, res)=>{

    card.find((err, temp)=>{
        res.render("index", {ejs_data:temp});
    });
    
})

app.post("/", (req, res)=>{
    let heading = req.body.title;
    let description = req.body.desc;
    let card_check = req.body.check;
    let remove = req.body.clear;

    const cardtemp = new card(
        {
            Title:heading,
            Description:description
        }
    );

    if(remove==="clearall"){
        card.remove({}, ()=>{});
    }

    if(heading){
        cardtemp.save();
    }    

    if(card_check){
        card.findByIdAndRemove({_id:card_check}, ()=>{});
        console.log("I am dead");
    }
 
    res.redirect("/");
})



app.listen(3000, ()=>{
    "listening to port 3000"
})