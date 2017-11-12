const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

function removeSkill(inputUserId, inputSkill, team_id) {
    mongo.connect(dbUrl, (err, db) => {
        assert.equal(null, err);

        const col = db.collection(`${team_id}_users`);
        const filter = {user_id: inputUserId}
        const { filtered } = Utils.removeLvlFromString(inputSkill);

        col.findOne(filter, (err, user) => {
            assert.equal(null, err);


            let newSkills =  user.skills.slice().filter(s => {
                return s.skill.toString().toUpperCase() !== filtered.toString().toUpperCase();
            });

            let tempUser = {
                skills: newSkills
            }

            col.findOneAndUpdate(filter, {$set: tempUser}, (err, user) => {
                assert.equal(null, err);
            });
        });
    });
}

module.exports = removeSkill;