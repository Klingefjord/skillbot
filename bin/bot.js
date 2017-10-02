'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongo = require('mongodb');
const assert = require('assert');

// routes
const addSkill = require('../controllers/addskill');
const removeSkill = require('../controllers/removeskill');
const listSkills = require('../controllers/listskills');
const changeLevel = require('../controllers/changelevel');
const removeUser = require('../controllers/removeuser');
const checkForMatch = require('../controllers/checkForMatch');
const addWtl = require('../controllers/addWtl');
const listKnowers = require('../controllers/listKnowers');

// extra
const renderColor = require('../util/pickColor');

const dbUrl = process.env.DB_URL;
const token = process.env.API_KEY;
const name = process.env.BOT_NAME;
const port = process.env.PORT || 4390;

// this gets filled when app is authorized
let access_token;

require('dotenv').config();

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
            access_token = JSON.parse(body).access_token;
            setupMatch({}, {});
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

app.post('/teachme', function(req, res) {
    let msg = req.body.text;
    let name = req.body.user_name;

    addWtl(name, msg).then(({tempUser, filtered}) => {
        checkForMatch(tempUser, filtered).then((matches) => {
            res.send(`${filtered} added to list of skills you wish to learn!`);

            for (var i = 0; i < matches.length; i++) {
                setupMatch(matches[i], tempUser);
            }
        });                        
    });
});

//@TODO list all users who know a certain skill
app.post('/knows', function(req, res) {
    let skill = req.body.text;
    listKnowers(skill).then(({doc, filtered}) => {

        let response = {
            "text": `These are the people who know ${filtered}`,
            "attachments": [
            ]
        }

        // @todo - attach user profile link & image
        console.log(doc, filtered);
        if (doc.length > 0) {
            doc.forEach(user => {
                console.log(user);
                let skill = user.skills.find(s => {
                    return s.skill === filtered;
                });

                response.attachments.push({
                    "title": `${user.user_name}`,
                    "text":  `Level: ${skill.lvl || "(not specified)"}`,
                    "color": renderColor(skill.lvl),
                });
            });
        } else {
            response = `Currently no people in this team know ${filtered}`;
        }

        res.send(response);
    });
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
        console.log(userObject);
        let response = {
            "text": `These are your current skills, ${userObject.user_name}`,
            "attachments": [
            ]
        }   

        try {
            if (userObject.skills.length > 0) {      
                userObject.skills.forEach((skill) => {
                    response.attachments.push({
                        "title": `${skill.skill}`,
                        "text":  `Level: ${skill.lvl || "(not specified)"}`,
                        "color": renderColor(skill.lvl),
                    });
                });
            }
        } catch(err) {
            console.log(err);
        }

        res.send(response);
    });
});

function findUserProfile(username) {
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    request({
        url: 'https://slack.com/api/users.profile.get', //URL to hit
        qs: {token: access_token, user: username, client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method
    }, function (error, response, body) {
        if (error) console.log(error);
        else console.log(body);
    });
}

function setupMatch(matchObject, user) {
    console.log(access_token);
    console.log("inside setup match");

    //const code = req.query.code;
    
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    request({
        url: 'https://slack.com/api/groups.create', //URL to hit
        qs: {token: access_token, name: "match", client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method
    }, function (error, response, body) {
        if (error) console.log(error);
    });

    request({
        url: 'https://slack.com/api/groups.invite', //URL to hit
        qs: {token: access_token, channel: "match", user: "Schruder", client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method
    }, function (error, response, body) {
        if (error) console.log(error);
    });

    request({
        url: 'https://slack.com/api/groups.setPurpose', //URL to hit
        qs: {token: access_token, channel: "match", purpose: "You have been matched! x knows y, and c knows a!", client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method
    }, function (error, response, body) {
        if (error) console.log(error);
    });
}

app.listen(port);