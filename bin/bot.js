'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongo = require('mongodb');
const assert = require('assert');

const authorizer = require('../authorizer');
const addSkill = require('../controllers/addskill');
const removeSkill = require('../controllers/removeskill');
const listSkills = require('../controllers/listskills');
const changeLevel = require('../controllers/changelevel');
const removeUser = require('../controllers/removeuser');

require('dotenv').config();

const dbUrl = process.env.DB_URL;
const token = process.env.API_KEY;
const name = process.env.BOT_NAME;
const port = process.env.PORT || 4390;

// beginning of app
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
    res.send("hello world!");
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
        }
    });
})

// @TODO: rewrite bot to use commands such as these instead!
app.post('/command', function(req, res) {
    res.send("works");
});

app.post('/addskill', function(req, res) {
    let msg = req.body.text;
    let name = req.body.user_name;
    
    addSkill(name, msg).then((response) => {
        res.send(response); 
    });
})

app.post('/removeskill', function(req, res) {
    let msg = req.body.text;
    let name = req.body.user_name;

    removeSkill(name, msg);
    res.send("Skill removed from your profile!");
});

app.post('/changelevel', function(req, res) {
    let response = "Skill updated!";
    let msg = req.body.text;
    let name = req.body.user_name;

    changeLevel(name, msg).then((success) => {
        if (!success) response = "You dont have that skill at the moment!";
        res.send(response);
    });
});

app.post('/bluepill', function(req, res) {
    let name = req.body.user_name;
    removeUser(name).then((response) => {
        console.log(response);
        res.send(response);
    })
});

app.post('/skills', function(req, res) {
    let name = req.body.user_name;

    listSkills(name).then((userObject) => {
        console.log("Helloeh?");
        console.log(userObject);

        let replyString = `Seems like you haven't added any skills so far!`;

        if (userObject) {
            replyString = `These are the skills you currently have, ${userObject.user_name}: \n`;

            userObject.skills.forEach((skill) => {
                replyString += `${skill.skill}, level ${skill.lvl || "not specified"} \n`;
            });
        }

        replyString += "\nTo remove a skill, use /removeskill. To modify a skill, use /changelevel <name of skill> <new level>";

        res.send(replyString);
    });
});

app.listen(port);

