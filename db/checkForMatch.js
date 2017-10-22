'use strict';

const mongo = require('mongodb').MongoClient;
const addToMatches = require('./addToMatches');
const assert = require('assert');
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

// @TODO make dbUrl connection string based on slack team name

function checkForMatch(user, wtl, team_id) {
    console.log("inside check for match", user, wtl);
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    })
    .then((db) => {
        return new Promise((resolve, reject) => {
            // returns array of users who know what they want to learn
            db.collection(`${team_id}_users`).find({ skills: { $elemMatch: { skill: wtl } } }).toArray((err, doc) => {
                if (err) reject(err);
                let matches = [];

                doc.forEach(matchedUser => {
                    // loop through wtl of matchedUsers
                    matchedUser.wtl.forEach(matchedWtl => {
                        console.log(matchedWtl);
                        // if match with skills
                        user.skills.forEach(skill => {
                            console.log(skill.skill)
                            if (matchedWtl === skill.skill && matchedUser.user_id !== user.user_id) {
                                matches.push({user: matchedUser, skill: wtl, wtl: skill.skill});
                            }
                        });
                    });
                });

                resolve(matches);
            });
        });
    }).then((matches) => {
        return new Promise((resolve, reject) => {
            if (matches.length > 0) {
                addToMatches(matches, team_id).then((count) => {
                    resolve({matches, count});
                });
            } else {
                resolve({matches});
            }
        });
    });
}

module.exports = checkForMatch;