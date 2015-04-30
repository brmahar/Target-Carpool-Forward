//Basic Setup

//Get required packages
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Config for bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//var Connection = require('tedious').Connection;
//mongoose connection to local DB

var port = process.env.PORT || 8080;
var router = require('./routes');

// this is for access control issues, when running a local
// node server and running the app, all calls to the api
// were rejected because of the different port numbers (8100 & 8080)
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//Register routes
// '/api' will be prefixed
app.use('/api', router);

//start the server
app.listen(port);
console.log('server start');






















//IGNORE
//broken Azure connection information

  // var config = {
  //   userName: 'brmahar@hen5ld7y81.database.windows.net',
  //   password: '',
  //   server: 'hen5ld7y81.database.windows.net',
    
  //   // If you're on Windows Azure, you will need this:
  //   encrypt: true,
  //   database:'ito-carpool'
  // };

  // var connection = new Connection(config);

  // connection.on('connect', function(err) {
  //  console.log('test');
  //    if(err) console.log(err);
  //   }
  // );
