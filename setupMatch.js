const request = require('request');
const Promise = require('bluebird');
const rp = require('request-promise');
const oauth = require('./db/oauth');

/**
* @param matchOject - object conatining a user, skill and wtl.
* @param user - user object
*/


module.exports = function setupMatch(matchObject, user, count, team_id) {
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;
 
 
    const createGroup = {
        url: 'https://slack.com/api/groups.create',
        qs: {token: "", name: `skill-match-${count}`, client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method   
    }
 
 
    let inviteToGroup = {
        url: 'https://slack.com/api/groups.invite',
        qs: {token: "", channel: "", user: user.user_id, client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method
    }
 
    let setPurpose = {
        url: 'https://slack.com/api/groups.setPurpose',
        qs: {token: "", 
            channel: "", 
            purpose: `You have been matched! ${user.user_name} knows about ${matchObject.wtl} whereas ${matchObject.user.user_name} knows about ${matchObject.skill}.`, 
            client_id: clientId, 
            client_secret: clientSecret}, //Query string data
        method: 'GET', //Specify the method 
    }
 
    //@TODO: Make sure to check if user is already invited
    // Then invite both users
    // Authenticated users can't invite themselves!!
    oauth.get(team_id).then((token) => {
        // set the correct access token for all requests
        createGroup.qs.token = token;
        inviteToGroup.qs.token = token;
        setPurpose.qs.token = token;
        
        rp(createGroup).then((jsonBody) => {
        
            let id = JSON.parse(jsonBody).group.id;
            inviteToGroup.qs.channel = id;
            setPurpose.qs.channel = id;

            let inviteToGroup2 = Object.assign({}, inviteToGroup);
            inviteToGroup2.qs.user = matchObject.user.user_id;

            rp(setPurpose);
            rp(inviteToGroup);
            rp(inviteToGroup2);

        }).catch((err) => {
            console.log(err);
        });
    });
}