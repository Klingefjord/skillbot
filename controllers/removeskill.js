'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

function removeSkill(inputUser, inputSkill) {
    mongo.connect(dbUrl, (err, db) => {
        assert.equal(null, err);

        const col = db.collection('users');
        const filter = {user_name: inputUser}
        const { filtered } = Utils.removeLvlFromString(inputSkill);

        col.findOne(filter, (err, user) => {
            assert.equal(null, err);
            
            let newSkills =  user.skills.slice().filter(s => {
                return s.skill.toString().toUpperCase() !== filtered.toString().toUpperCase();
            });

            newSkills.forEach(x => console.log("NEW", x));
            user.skills.forEach(x => console.log("OLD", x));

            let tempUser = {
                user_name: inputUser,
                skills: newSkills
            }

            col.findOneAndUpdate(filter, {$set: tempUser}, (err, user) => {
                assert.equal(null, err);
            });
        });
    });
}

module.exports = removeSkill;