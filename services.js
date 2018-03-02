var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var rabbitMessageBR = require('./receive.js');

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
    rabbitMessageBR.RabbitMQConsumer();
    res.send("Finished");
});

app.post('/', function(req, res) {

    var body = _.pick(req.body, "message");
    res.send(body.message);
    rabbitMessageBR.RabbitMQPublisher(body.message);
});

app.listen(3000, function() { console.log('Example app listening on port 3000!'); })