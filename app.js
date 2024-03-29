//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sarvesh:Timex1506@cluster0.iwura.mongodb.net/todolistDB");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your Todolist",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newAdds: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, function (err, foundList) {
    if (err) {
      console.log(err);
    } else {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newAdds: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  // console.log(req.body);
  const day = date.getDate();
  const itemName = req.body.newItem;
  // if (req.body.list === "Work List") {
  //     workItems.push(item)
  //     res.redirect('/work');

  // }
  // else {
  //     items.push(item);
  //     res.redirect("/");
  // }
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const day = date.getDate();
  const deleteItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndRemove(deleteItem, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted checked item");
      }
      res.redirect("/");
    });
  }
  else{
    List.findOneAndUpdate({name: listName},{$pull : {items : {_id : deleteItem}}}, function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }
 
});

app.post("work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if(port == null || port ==""){
  port = 3000;
}
// app.listen(port);

app.listen(port, function () {
  console.log("Server has started");
});
