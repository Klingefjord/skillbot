'use strict'
var SkillBot = require('../lib/skillbot');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var authorizer = require('../authorizer');
var request = require("request");
require('dotenv').config()

var token = process.env.API_KEY;
var name = process.env.BOT_NAME;

console.log(token);

// @todo - hide api key
var skillbot = new SkillBot({
    token: token,
    name: 'skillbot'
});

skillbot.run();

app.get('/', function(req, res) {
    res.send('hello world!');
})

app.get('/authorization', function(req, res) {
    const code = req.query.code;
    //let url = authorizer(code);

    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    request({
        url: 'https://slack.com/api/oauth.access', //URL to hit
        qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            res.json(body);
        }
    });
})


// @TODO: rewrite bot to use commands such as these instead!
app.post('/command', function(req, res) {
    res.send('Your ngrok tunnel is up and running!');
});

app.listen(4390);