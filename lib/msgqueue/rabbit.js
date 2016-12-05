

exports.sendData=function(options){
	console.log(options);
var data = JSON.stringify(options);
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://yqkistry:l84R0zn4Dl6R-9c1PrDfVhFr9pEc4DZN@hyena.rmq.cloudamqp.com/yqkistry', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'k8sQ';

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer(data));

    setTimeout(function() { conn.close();  }, 5000);
  });
});


}
