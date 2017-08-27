'use strict'
var SkillBot = require('../lib/skillbot');
var apikey = require('../apikey');

var token = apikey;
var name = process.env.BOT_NAME;

// @todo - hide api key
var skillbot = new SkillBot({
    token: token,
    name: 'skillbot'
});

skillbot.run();