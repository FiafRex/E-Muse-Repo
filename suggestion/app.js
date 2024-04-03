var express = require("express");
var bodyParser = require("body-parser");

const mongoose = require("mongoose");

// Connect to MongoDB
  mongoose.connect('mongodb://127.0.0.1:27017/suggestion');
  var db=mongoose.connection;
  db.on('error', console.log.bind(console, "connection error"));
  db.once('open', function(callback){
      console.log("connection succeeded");
  })

var app = express()

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended : true
}));

app.post('/suggestion', function(req, res){
  var username = req.body.username;
  var suggestion = req.body.suggestion;
  var data = {
    "username" : username,
    "suggestion" : suggestion
  }
  db.collection('details').insertOne(data, function(err, collection){
    if (err) throw err;
    console.log("Record Inserted Sucessfully");
  });

  return res.redirect('suggestion_success.html');
})

app.get('/', function(req, res){
  res.set({
    'Access-control-Allow-Origin': '*'
  });
  return res.redirect('index.html');
}).listen(4000)

console.log(`server listening at port https://localhost:4000`);
