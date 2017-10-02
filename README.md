# skillbot
[WIP] A slackbot matching people with mutual learning interests

### Installing

To run, you need to
* Host a mongodb database on port 21017
* Register a slack app for a team
* Add slash commands for routes
* Make sure to set up a https tunnel (I use ngrok for local development)

Go ahead and install dependencies:

```
npm install
```

To recieve an oauth token, open index.html and press "Add to Slack" button.
Run the app with:

```
npm start
```

## Built With

* Node.js
* Express
* MongoDB
* Slack API


