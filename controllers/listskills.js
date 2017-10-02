'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const addUser = require('./addUser');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

// @TODO make dbUrl connection string based on slack team name

function listSkills(inputUser) {
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    })
    .then((db) => {
        return new Promise((resolve, reject) => {
            db.collection('users').findOne({user_name: inputUser}, 
            (err, user) => {
                if (err) reject(err);
                else {
                    if (!user) {
                        addUser(inputUser).then((newUser) => {
                            db.close();
                            resolve(newUser);
                        });
                    } else {
                        db.close();
                        resolve(user);
                    }
                }
            });
        });
    });
}

module.exports = listSkills;