'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

function changeSkill(inputUserId, inputSkill, team_id) {
    const { filtered, level } = Utils.removeLvlFromString(inputSkill);
    const filter = {user_id: inputUserId}

    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    }).then((db) => {
        return new Promise((resolve, reject) => {
    
            // find user
            db.collection(`${team_id}_users`).findOne(filter, (err, user) => {
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
                skills: newSkills
            }

            db.collection(`${team_id}_users`).findOneAndUpdate(filter, {$set: tempUser}, (err, user) => {
                if (err) reject(err);
                else resolve(true);
                db.close();
            });
        });
    });
}

module.exports = changeSkill;