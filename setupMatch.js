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
       qs: {token: "", name: `Skill-match-${count}`, client_id: clientId, client_secret: clientSecret}, //Query string data
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

   oauth.get(team_id).then((token) => {
       // set the correct access token for all requests
       createGroup.qs.token = token;
       inviteToGroup.qs.token = token;
       setPurpose.qs.token = token;
       
       rp(createGroup).then((jsonBody) => {
           let obj = JSON.parse(jsonBody);
           inviteToGroup.qs.channel = JSON.parse(jsonBody).group.id;

           rp(inviteToGroup).then((jsonBody) => {
               setPurpose.qs.channel = JSON.parse(jsonBody).group.id;
               rp(setPurpose);
           });
       }).catch((err) => {
           console.log(err);
       });
   });

}