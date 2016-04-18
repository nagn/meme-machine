var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;


var MarkovChain = require('markovchain');
fs = require('fs')
var m = new MarkovChain(fs.readFileSync('./test.txt', 'utf8'));

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /\/bot chat/;


  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(request.text.replace('\/bot chat ', ''));
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(text) {
  var botResponse, options, body, botReq;

  botResponse = m.parse(text).end(5).process();


  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
