const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const findUserProfile = require('../user');
const Utils = require('../util/utils');
const addUser = require('./addUser');
require('dotenv').config();
const dbUrl = process.env.DB_URL;
// @TODO make dbUrl connection string based on slack team name

/**
 * Adds match objects to db and returns the count of total matches
 * @param matches - array of match objects
 */
function addToMatches(matches, team_id) {
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        });
    }).then((db) => { 
        return new Promise((resolve, reject) => {
            db.collection(`${team_id}_matches`).insert(matches, (err, user) => {
                if (err) reject(err);
                else resolve(db);
            });
        });
    }).then((db) => {
        return new Promise((resolve, reject) => {
            db.collection(`${team_id}_matches`).find().toArray((err, res) => {
                if(err) reject(err);
                else resolve(res.length);
                db.close();
            }); 
        });
    });
}

module.exports = addToMatches;