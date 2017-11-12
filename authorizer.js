const request = require('request');
const oauth = require('./db/oauth');

module.exports = function(req, res) {
    const code = req.query.code;
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    request({
        url: 'https://slack.com/api/oauth.access',
        qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
        method: 'GET',
    }, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            
            // Add access token to database
            const body = JSON.parse(response.body);
            const access_token = body.access_token;
            const team_id = body.team_id;

            oauth.set(team_id, access_token);
            console.log(body);
            res.json("Skillbase is added to your team!");
        }
    });
}

