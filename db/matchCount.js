'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;
const findUserProfile = require('../user');
// @TODO make dbUrl connection string based on slack team name

function addUser(inputUserId) {
    let userName;

    return new Promise((resolve, reject) => {
        resolve(findUserProfile({user_id: inputUserId}))
    }).then((profile) => {
        return new Promise((resolve, reject) => {
            userName = profile.display_name;

            mongo.connect(dbUrl, (err, db) => {
                if (err) reject(err);
                else resolve(db)
            })
        });
    }).then((db) => {
        return new Promise((resolve, reject) => {
            let newUser = {
                user_name: userName,
                user_id: inputUserId, 
                skills: [],
                wtl: []
            }

            db.collection(`${team_id}_users`).insert(newUser, (err, res) => {
                if (err) reject(err);
                else resolve(newUser);
                db.close();
            });
        });
    });
}

module.exports = addUser;