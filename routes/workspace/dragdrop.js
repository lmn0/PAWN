var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var url = 'mongodb://tjs:password@ds039684.mlab.com:39684/mongo';

//GET Req
router.get('/',function(req,res,next){
	res.render('workspace/newProject.ejs')
})


//POST Req
router.post('/fireUpContainers',function(req,res){
	var options;
	var body ='';
	req.on('data',function(chunk){
		body+=chunk.toString('utf8');
	});
	req.on('end',function(){
		var createsystem = require('../../lib/msgqueue/rabbit.js');
		options = JSON.parse(body);
		createsystem.sendData(options);

		
	mongoClient.connect ( url, function(err, db){
		if(err)
		{
			res.status(500).send({error:"Server error. Please try again later."})				
		}
		else{
			var projects = db.collection('projects');
			projects.update({id:options.id},{$set:options},{upsert:true});
			db.close;
			res.redirect('/dashboard');
		}
	})

		
	})

	
})

module.exports = router;