let amqp = require('amqplib/callback_api');
const RabbitMQ = {};
RabbitMQ.get_label = (no_serial, callback) => {
amqp.connect('amqp://TristoneDel:1234@10.56.98.128', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'task_queue';
    var msg = no_serial;

    channel.assertQueue(queue, {
      durable: true
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
    console.log(`[x] Sent '${msg}'`);
  });
  setTimeout(function() {
    connection.close();
    // process.exit(0)
  }, 500);
});

}

module.exports = RabbitMQ;