'use strict'
//var SkillBot = require('../lib/skillbot');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var authorizer = require('../authorizer');
var request = require("request");
var addSkill = require("../models/dbmanager");
//var skills = require("../skills");

require('dotenv').config()

var token = process.env.API_KEY;
var name = process.env.BOT_NAME;
var port = process.env.PORT || 4390;

console.log(token);

// @todo - hide api key

// skillbot.run();


// beginning of app

app.use(bodyParser.urlencoded({extended: true}))

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
            //setUpBot();
        }
    });
})


// @TODO: rewrite bot to use commands such as these instead!
app.post('/command', function(req, res) {
    res.send('works');
});

app.post('/skills', function(req, res) {
    let msg = req.body.text;
    let name = req.body.user_name;
    
    addSkill(name, msg);
    res.send('Skill added to your profile!');
    //res.send('testing');
})

app.listen(port);

