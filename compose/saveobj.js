//get the dockerfile


//build the image

//

var express = require('express'),
    async = require("async"),
    router = express.Router(),
   
   // r = require("../../lib/request"),
    request=require("request");
//var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
//var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
//var url = 'mongodb://localhost:27017/pyCloud';
// ===
//var assert = require('assert');

//var rpi=[0,0];

router.get(['/','/:action'],function(req,res, next){
console.log("inside");
res.render('home.html');
});

module.exports = router;