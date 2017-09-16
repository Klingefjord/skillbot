'use strict'

module.exports = (code) => {
    console.log('Authorizer was called');

    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    const oauthURL = 'https://slack.com/oauth.access?'
    + '&code=' + code
    + '&client_id=' + clientId
    + '&client_secret=' + clientSecret

    console.log(oauthURL);

    return oauthURL;
}