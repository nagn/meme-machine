var http, cool, bot, router, server, port;

var express = require('express');
var app = express();

http        = require('http');
cool        = require('cool-ascii-faces');
bot         = require('./bot.js');

// GET method route
app.get('/', function (req, res) {
  res.send(ping);
});

// POST method route
app.post('/', function (req, res) {
  res.send(bot.respond);
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Hey, I'm Cool Guy.");
}
