const request = require('request');

module.exports = function(req, res) {
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
        }
    });
}
///// DB URL IS HIDDEN HERE!
///// DB_URL=mongodb://oklingefjord:borealis66@ds227045.mlab.com:27045/skillbasedb
