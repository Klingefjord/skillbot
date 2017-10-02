'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';
// @TODO make dbUrl connection string based on slack team name

function addUser(inputUser) {
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db)
        })
    }).then((db) => {
        return new Promise((resolve, reject) => {
            let newUser = {
                user_name: inputUser, 
                skills: [],
                wtl: []
            }

            db.collection('users').insert(newUser, (err, res) => {
                if (err) reject(err);
                else resolve(newUser);
                db.close();
            });
        });
    });
}

module.exports = addUser;