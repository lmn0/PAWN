var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var url = 'mongodb://tjs:password@ds039684.mlab.com:39684/mongo';

//GET Req
router.get('/',function(req,res,next){
	
	// mongoClient.connect ( url, function(err, db){
	// 	if(err)
	// 	{
	// 		res.status(500).send({error:"Server error. Please try again later."})				
	// 	}
	// 	else{
	// 		var projects = db.collection('projects');
	// 		projects.update({id:options.id},{$set:options},{upsert:true});
	// 		db.close;
	// 		res.redirect('/dashboard');
	// 	}
	// })

	//Basically search for the project using href and display it in the front end if found, else open a new project.

	console.log(req.body);

	res.render('workspace/newProject.ejs')
})

router.post('/',function(req,res,next){
	
	mongoClient.connect ( url, function(err, db){
		if(err)
		{
			res.status(500).send({error:"Server error. Please try again later."})				
		}
		else{
			console.log(req.body);
			
			var collection = db.collection('projects');
			collection.find({id: req.body.project_id}).toArray(function (err, result) {
      			if (err) {
        			res.status(500).send({error:"Server error. Please try again later."})
      			} else if (result.length) {
      				console.log(result.length);
        			res.render('workspace/newProject.ejs',{projName:req.body.project_name,projId:req.body.project_id})
      			} else {
      				res.render('workspace/newProject.ejs',{projName:req.body.project_name,projId:req.body.project_id})
        			//console.log('No document(s) found with defined "find" criteria!');
      			}
      //Close connection
      			db.close();
    		});
			
			
		}
	})

	//Basically search for the project using href and display it in the front end if found, else open a new project.

	// var body ='';
	// req.on('data',function(chunk){
	// 	body+=chunk.toString('utf8');
	// });
	// req.on('end',function(){
		//console.log(req.body);

		
	// });
})


//POST Req
router.post('/fireUpContainers',function(req,res){
	var options;
	// var body ='';
	// req.on('data',function(chunk){
	// 	body+=chunk.toString('utf8');
	// });
	// req.on('end',function(){
		var createsystem = require('../../lib/msgqueue/rabbit.js');
		options = JSON.parse(req.body);
		createsystem.sendData(options,'k8s');

		
	mongoClient.connect ( url, function(err, db){
		if(err)
		{
			res.status(500).send({error:"Server error. Please try again later."})				
		}
		else{
			var projects = db.collection('projects');
			projects.update({href:options.project_href},{$set:options},{upsert:true});
			db.close;
			res.redirect('/dashboard');
		}
	})

		
	// })

	
})

module.exports = router;