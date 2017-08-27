'use strict';

var util = require('util');
var Bot = require('slackbots');

    var SkillBot = function Constructor(settings) {
        this.settings = settings;
        this.settings.name = this.settings.name || 'skillbot';
        this.user = null;
    };

    util.inherits(SkillBot, Bot);
    
    module.exports = SkillBot;


//================== Skillbot prototype functions =====================//

SkillBot.prototype._onStart = function() {
    this._loadBotUser();
    this._welcomeMessage();
}

/**
 *     Initial welcome message
 *     @todo set as_user to true (requires oauth)
 */
SkillBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel('general', 'Aloha!', {as_user: false});
};

/**
 *    Loads the user and saves it in skillbot object
 */
SkillBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

/**
 *     Runs when skillbot is setup
 */
SkillBot.prototype.run = function() {
    SkillBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    // this.on('message', this._onMessage);
}

