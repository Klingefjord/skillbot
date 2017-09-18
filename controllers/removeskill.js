'use strict'

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

function removeSkill(inputUser, inputSkill) {
    mongo.connect(dbUrl, (err, db) => {
        assert.equal(null, err);
        let tempUser;
        let col = db.collection('users');
        let filter = {user_name: inputUser}
        const { filtered } = Utils.removeLvlFromString(inputSkill);

        col.findOne(filter, (err, user) => {
            assert.equal(null, err);

            const oldSkills =  user.skills.slice();
            const newSkills = oldSkills.filter(s => s.toUpperCase() !== filtered.toUpperCase());

            tempUser = {
                user_name: inputUser,
                skills: newSkills
            }

            console.log("Temp user: " + tempUser);
            col.findOneAndUpdate(filter, {$set: tempUser}, (err, user) => {
                assert.equal(null, err);
                console.log("Temp user updated!");
            });
        });
    });
}

module.exports = removeSkill;