var amqp = require('amqplib/callback_api');
var amqpUrl = 'amqp://localhost';
var exchangeName = 'NotificationService';
var queueName = 'NotificationService';

module.exports.RabbitMQPublisher = function(message) {
    amqp.connect(amqpUrl, function(err, conn) {
        if (err != null) rabbitMQError(err);
        publisher(conn, message);
    });
};

module.exports.RabbitMQConsumer = function() {
    amqp.connect(amqpUrl, function(err, conn) {
        if (err != null) rabbitMQError(err);
        consumer(conn);
    });
};

function rabbitMQError(err) {
    console.error(err);
    process.exit(1);
}

//Publisher
function publisher(conn, rabbitMessage) {
    conn.createChannel(on_open);

    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(queueName);
        ch.assertExchange(exchangeName);
        ch.bindQueue(queueName, exchangeName, queueName);
        ch.sendToQueue(queueName, new Buffer(rabbitMessage));
    }

}

//Consumer
function consumer(conn) {
    var ok = conn.createChannel(on_open);

    function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(queueName);
        ch.consume(queueName, function(msg) {
            if (msg !== null) {
                console.log("Received Message:" + msg.content.toString());
                ch.ack(msg);
            }
        });
    }
}