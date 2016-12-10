var express = require('express');
var router = express.Router();
var stormpath=require('express-stormpath');
var stripe=require('stripe')("sk_test_g3WF6wdXVLB5GHA2bAgmW3RU");

var app=express();

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var url = 'mongodb://tjs:password@ds039684.mlab.com:39684/mongo';


router.get('/',function(req,res,next){

	console.log(req.user.customData.role);
console.log('User:',req.user.email,'jsut accessed the /home page');

	var client=req.app.get('stormpathClient')
	var projects=[];

 var dir_href=req.user.directory.href
	client.getDirectory(dir_href,function (err, directory) {
  
	directory.getGroups(function(err, groupsCollection) {
  groupsCollection.each(function(group, next) {
		if(group.name!='user'||group.name!='admin'){

		var resourceMonitor = require('../../lib/msgqueue/rabbit.js');
		options = {projId:(group.href).split('/')[5]};
		resourceMonitor.sendData(options,'projectResource');

			mongoClient.connect ( url, function(err, db){
		if(err)
		{
			res.status(500).send({error:"Server error. Please try again later."})				
		}
		else{
			
			var collection = db.collection('projectResource');
			collection.find({projId: (group.href).split('/')[5]}).toArray(function (err, result) {
      			if (err) {
        			res.status(500).send({error:"Server error. Please try again later."})
      			} else if (result.length) {
      				
      				projects.push({category:group.name,cpu:result[0].cpu,memory:result[0].memory});
      			
        		} else {
      				
      				
      			}
     
      			db.close();
    		});
			
			
		}
	});

		
	}

			

	})
  });

});

setTimeout(function(){
	//Query the MongoDB and get the project details - 


	console.log(projects);
		res.render('dashboard',{
    					user:req.user.username,
    					userhred:req.user.href,
    					projects:projects,
    					notes123:req.user.customData.totalNotes,
    					role:req.user.customData.role
					})


},3000);

});

// router.get('/create_user',stormpath.groupsRequired(['admin']),function(req,res,next){

// res.render('create_user.ejs')
// });

router.post('/get_resource',function(req,res,next){
	  


})

router.post('/write_note',function(req,res,next){
	  console.log(req.body);
		req.user.customData.totalNotes=req.body.data;
		req.user.customData.save()
		next()
})



router.post('/hi', function(req, res) {
  if (!req.user.customData.billingTier || req.user.customData.billingTier.id !== 'pro') {
    res.status(402).json({ error: 'Please Upgrade to the pro plan' });
  } else {
    res.status(200).json({ hi: 'there' });
  }
});


module.exports = router;
