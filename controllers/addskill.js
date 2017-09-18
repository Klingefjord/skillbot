'use strict'

var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var Utils = require('../util/utils');
var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';
// @TODO make dbUrl connection string based on slack team name

function addSkill(inputUser, inputText) {
    // make subarray out of input
    const pascalArr = Utils.toPascalCase(inputText).split(' ');
    const {level, filtered} = Utils.removeLvlFromString(pascalArr);

    console.log(dbUrl);
    mongo.connect(dbUrl, (err, db) => {
        assert.equal(null, err);
        db.collection('users').findOne({user_name: inputUser}, (err, user) => {
            if (!user) {
                console.log('Youre inside add new user!');
                let tempUser = {
                    user_name: inputUser,
                    skills: [{ skill: filtered, lvl: level }]
                };

                db.collection('users').insertOne(tempUser, (err, res) => {
                    assert.equal(null, err);
                    console.log('item inserted!');
                    db.close();
                });  
            } else {
                let updatedUser = user;
                console.log('Youre inside update user! ' + updatedUser);
                updatedUser.skills.forEach(x => console.log('skill: ' + x.skill + ' ' + x.lvl));
                updatedUser.skills.push({ skill: filtered, lvl: level });

                console.log('Updated user: ' + updatedUser);
                console.log('User: ' + inputUser);
                db.collection('users').updateOne({user_name: inputUser}, {$set: updatedUser}, (err, res) => {
                    console.log("it worked?");
                    assert.equal(null, err);
                    db.close();
                });
            }
        });
    });
}

module.exports = addSkill;