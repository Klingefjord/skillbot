'use strict';

var util = require('util');
var Bot = require('slackbots');
//var skillbase = require('./models/skillbase');

var SkillBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'skillbot';
    this.user = null;
};

util.inherits(SkillBot, Bot);
    
module.exports = SkillBot;


//================== Skillbot prototype functions =====================//

SkillBot.prototype._onStart = function() {
    console.log("inside start");
    this._loadBotUser();
    this._welcomeMessage();
}


/**
 *      Replies to a message
 *      @param message message object
 */
SkillBot.prototype._onMessage = function(message) {
    console.log("===========MESSAGE RECEIVED: ============ ");
    //console.log(message);
    if (this._isChatMessage(message)
        && this._isChannelConversation(message)
        && !this._isFromSkillBot(message)
        && this._isMentioningSkillBot(message)
    ) {
        this._replyWithRandomSkill(message);
    }
}

SkillBot.prototype._replyWithRandomSkill = function(originalMessage) {
    let tempUser = this.getUsers()._value.members.filter((u) => u.id === originalMessage.user);

    this.postMessageToUser(tempUser[0].name, 'I have been Summoned! How can I assist you, kind stranger?');
}

SkillBot.prototype._isMentioningSkillBot = function(message) {
    console.log(message.text);
    return message.text.toLowerCase().indexOf('skillbot') > -1 ||
           message.text.toLowerCase().indexOf(this.name ) > -1;
}

SkillBot.prototype._isFromSkillBot = function(message) {
    return message.user === this.user.id;
}

SkillBot.prototype._isChatMessage = function(message) {
    return message.type === 'message' && Boolean(message.text);
}

SkillBot.prototype._isChannelConversation = function(message) {
    return typeof message.channel === 'string';
    //&& message.channel[0].toUppper() === 'C';
}

// SkillBot.prototype._addSkill = function(message) {

//     let tempSkill = message.text.split(' ');

//     skills.push(new Skill(message.user, tempSkill[1], tempSkill[2]));
// }

/**
 *     Initial welcome message
 *     @todo set as_user to true (requires oauth)
 */
SkillBot.prototype._welcomeMessage = function() {
    this.postMessageToChannel('general', 'Hello!', {as_user: true});
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
 *     Runs when skillbot is set up
 */
SkillBot.prototype.run = function() {
    console.log("inside run");
    SkillBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
}

