'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

function changeSkill(inputUser, inputSkill) {
    const { filtered, level } = Utils.removeLvlFromString(inputSkill);
    const filter = {user_name: inputUser}

    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    }).then((db) => {
        return new Promise((resolve, reject) => {
    
            // find user
            db.collection('users').findOne(filter, (err, user) => {
                if (err) reject(err);
                else resolve({user, db});
            });
        });  
    }).then(({user, db}) => {
        return new Promise((resolve, reject) => {
            // replace level at skill
            let newSkills = [];
            
            user.skills.forEach((s) => {
                let skill = Object.assign({}, s);

                if (s.skill.toString().toUpperCase() === filtered.toString().toUpperCase()) {
                    skill.lvl = level;
                }

                newSkills.push(skill);
            });

            // if user does not have skill, return false
            if (JSON.stringify(newSkills) === JSON.stringify(user.skills)) {
                resolve(false);
            }

            let tempUser = {
                user_name: inputUser,
                skills: newSkills
            }

            db.collection('users').findOneAndUpdate(filter, {$set: tempUser}, (err, user) => {
                if (err) reject(err);
                else resolve(true);
                db.close();
            });
        });
    });
}

module.exports = changeSkill;