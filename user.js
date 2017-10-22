const request = require('request');

/*
*       Returns promise of slack JSON user details based on db user input
*/
module.exports = function findUserProfile(user) { 
    const access_token = process.env.TOKEN;
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    return new Promise((resolve, reject) => {
        request({
            url: 'https://slack.com/api/users.profile.get', //URL to hit
            qs: {token: access_token, user: user.user_id, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method
        }, function (error, response, body) {
            if (error) reject(error);
            else {
                resolve(JSON.parse(body).profile); 
            }
        });
    });
}