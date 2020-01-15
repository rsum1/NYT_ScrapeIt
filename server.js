var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var logger = require('morgan')

var express = require('express')
var app = express()

app.use(logger("dev"))
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

//Require handlebars
var exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Create localhost port on port 3000
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Listening on PORT " + port);
});