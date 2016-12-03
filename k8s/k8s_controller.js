var amqp=require('amqplib/callback_api')

var amqpURL="amqp://yqkistry:l84R0zn4Dl6R-9c1PrDfVhFr9pEc4DZN@hyena.rmq.cloudamqp.com/yqkistry"

var fs = require('fs');
var dir = './tmp';
var jsonfile = require('jsonfile');


amqp.connect(amqpURL,function(err,conn){
  conn.createChannel(function(err,ch){
    var q ='k8dcontroller'
    ch.assertQueue(q,{durable:false})
    console.log("<- wAiting for messages in %s",q)
    ch.consume(q,function(msg){
    
    	var jsondata={};
      	console.log("<- Recieved %s ",msg.content.toString());
      	jsondata = JSON.parse(msg.content.toString());

     	dir = dir + jsondata.projectID;
     	if(!fs.existsSync(dir)){
      		fs.mkdirSync(dir);
     	}

     	for(key in jsondata.config){
      		jsonfile.writeFile(dir+'/'+key+'.json',jsondata.config[key],function(){
      			console.err(err);
      		})

     	}



    },{noAck:true})
  })
})
