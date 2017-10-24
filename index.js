'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongo = require('mongodb');
const assert = require('assert');
const Promise = require('bluebird');
const rp = require('request-promise');

// db controllers
const addSkill = require('./db/addskill');
const removeSkill = require('./db/removeskill');
const findUser = require('./db/findUser');
const changeLevel = require('./db/changelevel');
const removeUser = require('./db/removeuser');
const checkForMatch = require('./db/checkForMatch');
const addWtl = require('./db/addWtl');

// routes
const addSkillRoute = require('./routes/addskill');
const knowsRoute = require('./routes/knows');
const listWtlRoute = require('./routes/listWtl');
const bluePill = require('./routes/bluePill');

// extra
const renderColor = require('./util/pickColor');
const authorizer = require('./authorizer');
const findUserProfile = require('./user.js');

require('dotenv').config();

const dbUrl = process.env.DB_URL;
const token = process.env.API_KEY;
const port = process.env.PORT || 4390;

let access_token = process.env.TOKEN;


// beginning of app
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.post('/bluepill', bluePill);
app.get('/authorization', authorizer);

app.post('/command', function(req, res) {
    res.send("works");
});


app.post('/addskill', addSkillRoute);
app.post('/learning', listWtlRoute);

app.post('/removeskill', function(req, res) {
    let msg = req.body.text;
    let id = req.body.user_id;
    let team_id = req.body.team_id;

    removeSkill(id, msg, team_id);
    res.send("Skill removed from your profile!");
});

app.post('/teachme', function(req, res) {
    let msg = req.body.text;
    let userId = req.body.user_id;
    let team_id = req.body.team_id;    

    addWtl(msg, userId, team_id).then(({ tempUser, filtered }) => {
        checkForMatch(tempUser, filtered, team_id).then(({matches, count}) => {
            console.log(matches.length, "MATCH LENGTH");
            for (var i = 0; i < matches.length; i++) {
                console.log("INSIDE MAAAAAAATCH!!!");
                setupMatch(matches[i], tempUser, count);
            }

            knowsRoute({ body: { text: filtered } }, res);
        }); 
    });
});

//@TODO list all users who know a certain skill
app.post('/knows', knowsRoute);

app.post('/changelevel', function(req, res) {
    let response = "Skill updated!";
    let msg = req.body.text;
    let id = req.body.user_id;
    let team_id = req.body.team_id;    

    changeLevel(id, msg, team_id).then((success) => {
        if (!success) response = "You don't seem to have that skill at the moment!";
        res.send(response);
    });
});

app.post('/bluepill', function(req, res) {
    let id = req.body.user_id;
    let team_id = req.body.team_id;
    
    removeUser(id, team_id).then((response) => {
        console.log(response);
        res.send(response);
    })
});

app.post('/skills', function(req, res) {
    let id = req.body.user_id;
    let team_id = req.body.team_id;    
    let response;
    
    findUser(id, team_id).then((userObject) => {
        response = {
            "text": `These are your current skills, ${userObject.user_name}`,
            "attachments": [
            ]
        }   

        if (userObject.skills.length > 0) {      
            userObject.skills.forEach((skill) => {
                response.attachments.push({
                    "title": `${skill.skill}`,
                    "text":  `Level: ${skill.lvl || "(not specified)"}`,
                    "color": renderColor(skill.lvl),
                });
            });
        } else {
            response = `Seems you don't have any skills yet ${userObject.user_name}. Add one using /addskill <name of skill>`;
        }

        res.send(response);
    });
});

/**
 * @param matchOject - object conatining a user, skill and wtl.
 * @param user - user object
 */

 //@todo fix this function
function setupMatch(matchObject, user, count) {
    console.log("MATCH OBJECT", matchObject);
    console.log("USER", user);
    
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    const createGroup = {
        url: 'https://slack.com/api/groups.create',
        qs: {token: access_token, name: `Skill-match-${count}`, client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method   
    }


    let inviteToGroup = {
        url: 'https://slack.com/api/groups.invite',
        qs: {token: access_token, channel: "INSERT_ID_HERE", user: user.user_id, client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method
    }

    let setPurpose = {
        url: 'https://slack.com/api/groups.setPurpose',
        qs: {token: access_token, 
            channel: `INSERT_ID_HERE`, 
            purpose: `You have been matched! ${user.user_name} knows about ${matchObject.wtl} whereas ${matchObject.user.user_name} knows about ${matchObject.skill}.`, 
            client_id: clientId, 
            client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method 
    }


    rp(createGroup)
        .then((jsonBody) => {
            console.log(jsonBody);
            let obj = JSON.parse(jsonBody);
            inviteToGroup.qs.channel = JSON.parse(jsonBody).group.id;
            rp(inviteToGroup)
                .then((jsonBody) => {
                    console.log(jsonBody);
                    setPurpose.qs.channel = JSON.parse(jsonBody).group.id;
                    rp(setPurpose)
                });
        })
        .catch((err) => {
            console.log(err);
        });

}

app.listen(port);