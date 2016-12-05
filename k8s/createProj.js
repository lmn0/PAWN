var amqp=require('amqplib/callback_api')

var amqpURL="amqp://yqkistry:l84R0zn4Dl6R-9c1PrDfVhFr9pEc4DZN@hyena.rmq.cloudamqp.com/yqkistry"
//Add response!
var fs = require('fs');
var jsonfile = require('jsonfile');
var json2yaml = require('json2yaml');
var y = require('yamljs');
var k8s = require('k8s');
//var jy = require('node-yaml');

amqp.connect(amqpURL,function(err,conn){
  conn.createChannel(function(err,ch){
    var q ='k8scontroller'
    ch.assertQueue(q,{durable:false})
    console.log("<- wAiting for messages in %s",q)
    ch.consume(q,function(msg){
    
      var jsondata={};
        console.log("<- Recieved %s ",msg.content.toString());
        jsondata = JSON.parse(msg.content.toString());

      var dir = "./tmp/"+"test";//jsondata.projectID;
      if(!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }

      for(key in jsondata.config){
    delete_null(jsondata.config);
    delete_empty(jsondata.config);

    function delete_null( obj ){
      for ( var i in obj ){
        if( obj[i] === null || obj[i] ==="" || obj[i] === "null")
          delete obj[i];  
        else if( typeof obj[i] === 'object')
          delete_null(obj[i])
      }
    }
    function delete_empty( obj ,parent, idx){
      if(obj=={})
        delete parent[idx];
      for ( var i in obj ){
        if( obj[i] == {} || obj[i] == []){
          try{  
            console.log(">>>>"+obj[i]);
            //delete(obj[i]);
            obj=obj.splice(i,1);  
          }
          catch(err){
            delete obj[i];
          }
        }
        else if( typeof obj[i] === 'object')
          delete_empty(obj[i],obj,i)
        }               
    }
  
    var yaml = json2yaml.stringify(jsondata.config[key]);
    var ym = y.stringify(yaml);
    console.log("\n\n" + yaml);
          //jsonfile.writeFile(dir+'/'+key+'.yaml',yaml,function(){
          //  console.error(err);
          //})
    //yaml.write(dir+'/'+key+'.yaml',yaml,'utf8',function(err){
    //  console.error(err);
    //});
    fs.writeFile(dir+'/'+key+'.yaml',yaml,'utf8' ,function (err) {
          if (err) return console.log(err);
          var exec = require('child_process').exec;
          var cmd = 'sudo kubectl create -f ./tmp/vo';

          exec(cmd,function(err,stdout,stderr){
            // console.log(err);
            // console.log("-------------------------------");
            // console.log(stdout);
            // console.log("-------------------------------");
            // console.log(stderr);
            // console.log("-------------------------------");
            if(err ==null){

            }
          });

      });

      }





    },{noAck:false})
  })
})