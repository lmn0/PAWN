

exports.sendData=function(options){

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://pawn:password@35.161.208.160', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer(options));
    console.log(" [x] Sent 'Hello World!'");
    setTimeout(function() { conn.close();  }, 500);
  });
});


}
