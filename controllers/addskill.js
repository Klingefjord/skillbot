'use strict'

var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var Utils = require('../util/utils');
var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';
// @TODO make dbUrl connection string based on slack team name

function addSkill(inputUser, inputText) {
    // make subarray out of input
    const pascalArr = Utils.toPascalCase(inputText);
    const {level, filtered} = Utils.removeLvlFromString(pascalArr);

    console.log(dbUrl);
    mongo.connect(dbUrl, (err, db) => {
        assert.equal(null, err);
        db.collection('users').findOne({user_name: inputUser}, (err, user) => {

            // copy user object
            let updatedUser = Object.assign({}, user);

            // replace null array for nonexistant user
            if(!Utils.userExists(updatedUser)) {
                updatedUser.skills = [];
            }

            // push values to skills array
            updatedUser.skills.push({ skill: filtered, lvl: level });

            // update user
            db.collection('users').updateOne({user_name: inputUser}, {$set: updatedUser}, (err, res) => {
                assert.equal(null, err);
                db.close();
            });
        });
    });
}

module.exports = addSkill;