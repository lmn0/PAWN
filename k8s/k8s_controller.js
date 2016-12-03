var amqp=require('amqplib/callback_api')

var amqpURL="amqp://yqkistry:l84R0zn4Dl6R-9c1PrDfVhFr9pEc4DZN@hyena.rmq.cloudamqp.com/yqkistry"

amqp.connect(amqpURL,function(err,conn){
  conn.createChannel(function(err,ch){
    var q ='k8dcontroller'
    ch.assertQueue(q,{durable:false})
    console.log("<- wAiting for messages in %s",q)
    ch.consume(q,function(msg){
      console.log("<- Recieved %s ",msg.content.toString());
    },{noAck:true})
  })
})
