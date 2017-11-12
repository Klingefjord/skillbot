const request = require('request');
const oauth = require('./db/oauth');

/*
*       Returns promise of slack JSON user details based on db user input
*/
module.exports = function findUserProfile(user_id, team_id) { 
    
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    return new Promise((resolve, reject) => {
        oauth.get(team_id).then((token) => {
            request({
                url: 'https://slack.com/api/users.profile.get',
                qs: {token: token, user: user_id, client_id: clientId, client_secret: clientSecret},
                method: 'GET',
            }, function (error, response, body) {
                if (error) reject(error);
                else {
                    resolve(JSON.parse(body).profile); 
                }
            });  
        });
    });
}