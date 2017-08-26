var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.status(200).send('Hello World!');
});

app.listen(port, () => console.log('Listening on port ' + port));


// POST request
app.post('/hola', function(req, res, next) {
    var userName = req.body.user_name;
    var botPayLoad = {
        text: 'Hello kind stranger! I am still in alpha, don\'t judge me!'
    };

    if (userName !== 'slackbot') {
        return res.status(200).json(botPayLoad);
    } else {
        return res.status(200).end();
    }
});