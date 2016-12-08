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
			collection.find({projId: req.body.project_id}).toArray(function (err, result) {
      			if (err) {
        			res.status(500).send({error:"Server error. Please try again later."})
      			} else if (result.length) {
      				console.log(result);
        			res.render('workspace/newProject.ejs',{projName:req.body.project_name,projId:req.body.project_id,projDesc:result[0].projDesc,chart:result[0].chart,config:result[0].config})
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
		options = req.body;
		

		
	mongoClient.connect ( url, function(err, db){
		if(err)
		{
			console.log(err);
			res.status(500).send({error:"Server error. Please try again later."})				
		}
		else{
			var svcnames=[];
			var projects = db.collection('projects');
			
			var projStatus = db.collection('projectStatus');
			for(key in options.config){
				options.config[key].metadata.namespace=options.projId;
				if(key.split('_')[0]==="service")
					svcnames.push(options.config[key].metadata.name)
					
					}
			createsystem.sendData(options,'createProject');
			projects.update({projId:options.projId},{$set:options},{upsert:true});
			projStatus.update({projId:options.projId},{$set:{status:"notstarted",svcnames:svcnames}},{upsert:true})
			
			db.close;
			res.redirect('/projects');
		}
	})
	
		
	// })

	
})

module.exports = router;