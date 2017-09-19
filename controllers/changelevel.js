'use strict'

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

function changeSkill(inputUser, inputSkill) {
    mongo.connect(dbUrl, (err, db) => {
        db.collection('user').findOneAndRemove({user_name: inputUser}, {$set: {user_name: inputUser, skills: []}}, (err, user) => {
            console.log('it is done...');
        });
    });
    //     assert.equal(null, err);

    //     const col = db.collection('users');
    //     const filter = {user_name: inputUser}
    //     const { filtered, level } = Utils.removeLvlFromString(inputSkill);

    //     col.findOne(filter, (err, user) => {
    //         assert.equal(null, err);
            
    //         let newSkills =  user.skills.slice().forEach((s) => {
    //             if (s.skill.toString().toUpperCase() === filtered.toString().toUpperCase()) {
    //                 s.level = level;
    //             }
    //         });

    //         let tempUser = {
    //             user_name: inputUser,
    //             skills: newSkills
    //         }

    //         col.findOneAndUpdate(filter, {$set: tempUser}, (err, user) => {
    //             assert.equal(null, err);
    //         });
    //     });
    // });
}

module.exports = changeSkill;