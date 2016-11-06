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
//console.log("inside");

  // check if custom jade file exists for this page
  try {
    pageTemplate = pageID + ".jade";
    f = fs.openSync(path.join(pagesURL, pageTemplate), 'r');
    fs.closeSync(f);
  } catch(e) {
    pageTemplate = "page.jade";
    if(staticPages.hasOwnProperty(pageID)) {
      html = staticPages[pageID].call(this, req);
    } else {
      show404 = true;
    }
  }
  // ===

  if(show404) {
    templatePath = path.join(viewsURL, "404.jade");
    res.status(404)
       .render(templatePath, {
          html: html,
          pageTitle: "Sensed!"
    });
} 

res.render('drag.jade');
});

module.exports = router;