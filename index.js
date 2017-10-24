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
const findUser = require('./db/findUser');
const changeLevel = require('./db/changelevel');
const removeUser = require('./db/removeuser');
const checkForMatch = require('./db/checkForMatch');
const addWtl = require('./db/addWtl');

// routes
const addSkillRoute = require('./routes/addskill');
const knowsRoute = require('./routes/knows');
const listWtlRoute = require('./routes/listWtl');
const removeSkill = require('./routes/removeSkill');
const bluePill = require('./routes/bluePill');
const listSkills = require('./routes/listSkills');

// extra
const renderColor = require('./util/pickColor');
const authorizer = require('./authorizer');
const findUserProfile = require('./user.js');


/////////// set up enviroment variables
require('dotenv').config();

const dbUrl = process.env.DB_URL;
const token = process.env.API_KEY;
const port = process.env.PORT || 4390;
let access_token = process.env.TOKEN;
//////////

// beginning of app
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.post('/knows', knowsRoute);
app.post('/changelevel', changeLevel);
app.post('/bluepill', bluePill);
app.post('/skills', listSkills);
app.get('/authorization', authorizer);
app.post('/addskill', addSkillRoute);
app.post('/learning', listWtlRoute);
app.post('/removeskill', removeSkill);


//@TODO: move teachme and setupmatch into seperate route
app.post('/teachme', function(req, res) {
    let msg = req.body.text;
    let userId = req.body.user_id;
    let team_id = req.body.team_id;    

    addWtl(msg, userId, team_id).then(({ tempUser, filtered }) => {
        // check if there is a match with wtl
        checkForMatch(tempUser, filtered, team_id).then(({matches, count}) => {
            for (var i = 0; i < matches.length; i++) {
                setupMatch(matches[i], tempUser, count);
            }

            // check if someone knows wtl
            knowsRoute({ body: { text: filtered } }, res);
        }); 
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