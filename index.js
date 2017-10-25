const express = require('express');
const bodyParser = require('body-parser');

// route functions
const changeLevel = require('./routes/changelevel');
const addSkillRoute = require('./routes/addskill');
const knowsRoute = require('./routes/knows');
const listWtlRoute = require('./routes/listWtl');
const removeSkill = require('./routes/removeSkill');
const bluePill = require('./routes/bluePill');
const listSkills = require('./routes/listSkills');
const teachMeRoute = require('./routes/teachMe');
const authorizer = require('./authorizer');

/////////// set up enviroment variables
require('dotenv').config();

//////////// beginning of app
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

///////// Routes
app.get('/authorization', authorizer);

app.post('/knows', knowsRoute);
app.post('/changelevel', changeLevel);
app.post('/bluepill', bluePill);
app.post('/skills', listSkills);
app.post('/addskill', addSkillRoute);
app.post('/learning', listWtlRoute);
app.post('/removeskill', removeSkill);
app.post('/teachme', teachMeRoute);

/////// Start listening
app.listen(process.env.PORT);