'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

function removeUser(inputUserId, team_id) {
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db)
        })
    }).then((db) => {
        return new Promise((resolve, reject) => {
            db.collection(`${team_id}_users`).remove({user_id: inputUserId}, true, (err, res) => {
                if (err) reject(err)
                else resolve('It is done...');
                db.close();
            });
        });
    });
}

module.exports = removeUser;