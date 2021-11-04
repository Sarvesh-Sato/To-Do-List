//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static("public"));




const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];


app.get("/", function (req, res) {

    const day = date.getDate();
    res.render("list", { listTitle: day, newAdds: items });
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