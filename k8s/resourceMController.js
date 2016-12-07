//Get the request from queue and see if the project is running if it is running send the resources to the front end.

//Check all the project queues

//Get the project - pods and svc details from DB

var amqp=require('amqplib/callback_api')

var amqpURL="amqp://yqkistry:l84R0zn4Dl6R-9c1PrDfVhFr9pEc4DZN@hyena.rmq.cloudamqp.com/yqkistry"
var url = 'mongodb://tjs:password@ds039684.mlab.com:39684/mongo';
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
// var fs = require('fs');
// var jsonfile = require('jsonfile');
// var json2yaml = require('json2yaml');
// var k8s = require('k8s');

amqp.connect(amqpURL,function(err,conn){
  conn.createChannel(function(err,ch){
   	var q ='svcStatus'
   	ch.assertQueue(q,{durable:false})
    console.log("<- wAiting for messages in %s",q)
    //ch.prefetch(1);
    ch.consume(q,function(msg){

    	var jsondata={};
        console.log("<- Recieved %s ",msg.content.toString());
        jsondata = JSON.parse(msg.content.toString());
        var runstatus=[];
        mongoClient.connect ( url, function(err, db){
		if(err)
		{
			console.log(err);
			res.status(500).send({error:"Server error. Please try again later."})				
		}
		else{
			var svcnames=[];
			var projStatus = db.collection('projectStatus');
          	

			projStatus.find({projId:jsondata.projId}).toArray(function (err, result) {
      			if (err) {
        			console.log(err);
      			} else if (result.length) {
      				var status=0;
        			for(i=0; i<result[0].svcnames.length;i++)
        			{
        				var exec = require('child_process').exec;
        				var cmd = 'sudo kubectl get -o json svc '+result[0].svcnames[i];
        				exec(cmd,function(err,stdout,stderr){
        					if(err ==null && stderr == null){
        						var data = JSON.parse(stdout);
        						runstatus.push(data.status.loadBalancer.ingress.ip+":"+data.spec.ports.port);
        					}
        					else
        						status=1;
        				});
        			}
        			if(status==0)
        				projStatus.update({projId:jsondata.projId},{$set:{status:"notstarted",ip:runstatus.join()}},{upsert:true})
      			} else {
        			console.log('No document(s) found with defined "find" criteria!');
      			}
     
    		});

			
			
			db.close;
			res.redirect('/projects');
		}
		})


    	},{noAck:false})
   });
});

