var amqp=require('amqplib/callback_api')

var amqpURL="amqp://yqkistry:l84R0zn4Dl6R-9c1PrDfVhFr9pEc4DZN@hyena.rmq.cloudamqp.com/yqkistry"
//Add response!
var fs = require('fs');
var jsonfile = require('jsonfile');
var json2yaml = require('json2yaml');
var y = require('yamljs');
var mongodb = require('mongodb');
var request = require('request');
var mongoClient = mongodb.MongoClient;
//var k8s = require('k8s');
//var jy = require('node-yaml');

var url = 'mongodb://tjs:password@ds039684.mlab.com:39684/mongo';

amqp.connect(amqpURL,function(err,conn){
  conn.createChannel(function(err,ch){
    var q ='projectResource'
    ch.assertQueue(q,{durable:false})
    console.log("<- wAiting for messages in %s",q)
    //ch.prefetch(1);
    	ch.consume(q,function(msg){

    		var jsondata={};
        	console.log("<- Recieved %s ",msg.content.toString());
        	jsondata = JSON.parse(msg.content.toString());


       		mongoClient.connect ( url, function(err, db){
				if(err)
				{
					console.log(err);
					res.status(500).send({error:"Server error. Please try again later."})				
				}
				else{
					var svcnames=[];
					var projResource = db.collection('projectResource');
					///////////
					request
  					.get('localhost:8080/api/v1/proxy/namespaces/kube-system/services/heapster/api/v1/model/namespaces/'+(jsondata.projId).toLowerCase()+'/metrics/memory-usage')
  					.on('response', function(response) {
    					console.log(response.body) // 200 
    					projResource.update({projId:jsondata.projId},{$set:{memory:response.body.metrics[0].value,cpu:Math.floor(Math.random()*20)}},{upsert:true}); 
  					})
					
					////////////
				}
			});
        	

       },{noAck:false})
	})
})