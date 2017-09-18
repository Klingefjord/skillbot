'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var mongo = require('mongodb');
var assert = require('assert');

var authorizer = require('../authorizer');
var addSkill = require("../controllers/addskill");
var listSkills = require("../controllers/listskills")

require('dotenv').config();

var dbUrl = process.env.DB_URL;
var token = process.env.API_KEY;
var name = process.env.BOT_NAME;
var port = process.env.PORT || 4390;

// beginning of app
var app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
    res.send('hello world!');
})

app.get('/authorization', function(req, res) {
    const code = req.query.code;

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

app.post('/addskill', function(req, res) {
    let msg = req.body.text;
    let name = req.body.user_name;
    
    addSkill(name, msg);
    res.send('Skill added to your profile!');
})

app.post('/removeskill', function(req, res) {
    let msg = req.body.text;

});

app.post('/skills', function(req, res) {
    let name = req.body.user_name;

    listSkills(name).then((userObject) => {
        console.log(userObject);

        let replyString = `These are the skills you currently have, ${userObject.user_name}: \n`;
        userObject.skills.forEach((skill) => {
            replyString += `${skill.skill}, level ${skill.lvl} \n`;
        });
        replyString += "\nTo remove a skill, use /removeskill. To modify a skill, use /changeskill <name of skill>";
        res.send(replyString);
    });
});

app.listen(port);

