var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var url = 'mongodb://tjs:password@ds039684.mlab.com:39684/mongo';


export.queryProject=function(){

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
	//Query all the projects that belongs to user
	return 0;
}