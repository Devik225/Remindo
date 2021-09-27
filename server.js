
// Server

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb+srv://danny:gullu123@cluster0.nge1k.mongodb.net/Remindo");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//cards
const cardSchema = new mongoose.Schema({
    Title:String,
    Description:String
});

const card = mongoose.model("card", cardSchema);


//profiles
const profileSchema = new mongoose.Schema({
    Name: String,
    total_tasks:Number,
    tasks_done:Number,
    profiles: [cardSchema]
});

const profile = mongoose.model("profile", profileSchema);

app.get("/", (req, res)=>{
    const user = "Recent";

    profile.findOne({Name:user}, (err, found)=>{
        if(!found){
            const usertemp = new profile({
                Name:user,
                total_tasks:0,
                tasks_done:0,
                profiles: []
            });
        
            usertemp.save();
            res.redirect("/");
        }
        else{
            res.render("index", {
                ejs_pageName:user,
                ejs_data: found.profiles, 
                ejs_total: found.total_tasks,
                ejs_done: found.tasks_done,
                ejs_pending: found.total_tasks - found.tasks_done
            });
        }
    });

    
})

app.get("/:newurl", (req, res)=>{
    const user = req.params.newurl;

    profile.findOne({Name:user}, (err, found)=>{
        if(!found){
            const usertemp = new profile({
                Name:user,
                total_tasks:0,
                tasks_done:0,
                profiles: []
            });
        
            usertemp.save();
            res.redirect("/" + user);
        }
        else{
            res.render("index", {
                ejs_pageName:user,
                ejs_data: found.profiles, 
                ejs_total: found.total_tasks,
                ejs_done: found.tasks_done,
                ejs_pending: found.total_tasks - found.tasks_done
            });
        }
    });

    
})

app.post("/delete",(req, res)=>{
    let page_profile = _.capitalize(req.body.clear);
    profile.findOne({Name:page_profile}, (err, found)=>{

        found.profiles = [];
        found.total_tasks=0;
        found.tasks_done=0;
        found.save();

    });

    res.redirect("/" + page_profile);
})



app.post("/", (req, res)=>{
    let heading = req.body.title;
    let description = req.body.desc;
    let page_profile = _.capitalize(req.body._profile);

    const cardtemp = new card(
        {
            Title:heading,
            Description:description
        }
    );

    if(heading){
        profile.findOne({Name:page_profile}, (err, found)=>{

            console.log(found);
            found.profiles.push(cardtemp);
            found.total_tasks++;
            found.save();

        });
    }     
    res.redirect("/" + page_profile);
})



app.post("/removeCard",(req, res)=>{
    let page_profile = _.capitalize(req.body.check);
    let id_p = req.body.id;

    profile.findOne({Name:page_profile}, (err, found)=>{
        found.tasks_done++;
        found.save();

    });
    
    profile.findOneAndUpdate({Name:page_profile}, {$pull:{profiles: {_id:id_p}}}, (err, found)=>{
        res.redirect("/" + page_profile);
    })    
})

app.post("/user",(req, res)=>{
    let page_profile = _.capitalize(req.body.user);
    res.redirect('/' + page_profile);
})


let port = process.env.PORT;
if(port == null || port == ""){
    port=3000;
}


app.listen(3000, ()=>{
    "listening to port 3000"
})