'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

function removeUser(inputUser) {
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db)
        })
    }).then((db) => {
        return new Promise((resolve, reject) => {
            db.collection('users').remove({user_name: inputUser}, true, (err, res) => {
                if (err) reject(err)
                else resolve('It is done...');
                db.close();
            });
        });
    });
}

module.exports = removeUser;