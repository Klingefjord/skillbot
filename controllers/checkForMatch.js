'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

// @TODO make dbUrl connection string based on slack team name

function checkForMatch(user, wtl) {
    console.log("inside check for match", user, wtl);
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    })
    .then((db) => {
        return new Promise((resolve, reject) => {
            db.collection('users').find({ skills: { $elemMatch: { skill: wtl } } }).toArray((err, doc) => {
                if (err) reject(err);
                let matches = [];
                console.log("Result from first query");
                console.log(doc);

                doc.forEach(matchedUser => {
                    // loop through wtl of matchedUsers
                    matchedUser.wtl.forEach(matchedWtl => {
                        console.log(matchedWtl);
                        // if match with skills
                        user.skills.forEach(skill => {
                            console.log(skill.skill)
                            if (matchedWtl === skill.skill) {
                                console.log("MATCH");
                                matches.push({user: matchedUser, skill: matchedWtl, wtl: skill.skill});
                            }
                        });
                    });
                });
                console.log("matches");
                console.log(matches);
                resolve(matches);
            });
        });
    });
}

module.exports = checkForMatch;