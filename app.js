//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema ={
    name : String
};

const Item = mongoose.model("Item", itemsSchema);


const item1= new Item({
    name : "Welcome to your todolist!"
});

const item2= new Item({
    name : "Hit the + button to add a new it."
});


const item3= new Item({
    name : "<-- Hit this to delete an item"
});


const defaultItems = [item1 , item2 , item3 ];





app.get("/", function (req, res) {
    Item.find({}, function(err , foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Items added succsfully!");
                }
            });
            res.redirect("/");
        }else{
            res.render("list", { listTitle: "Today", newAdds: foundItems });

        }
        
    });
});

 



app.post("/", function (req, res) {
    console.log(req.body);
    const item = req.body.newItem;
    if (req.body.list === "Work List") {
        workItems.push(item)
        res.redirect('/work');

    }
    else {
        items.push(item);
        res.redirect("/");
    }

});


app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newAdds: workItems });
});

app.post("work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})


app.get("/about", function (req, res) {
    res.render("about");
})

app.listen(3000, function () {
    console.log("Server started on port 3000");

});