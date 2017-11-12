const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const addUser = require('./addUser');
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

// @TODO make dbUrl connection string based on slack team name

function findUser(inputId, team_id) {
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    })
    .then((db) => {
        return new Promise((resolve, reject) => {
            db.collection(`${team_id}_users`).findOne({user_id: inputId}, 
            (err, user) => {
                if (err) reject(err);
                else {
                    if (!user) {
                        addUser(inputId, team_id).then((newUser) => {
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

module.exports = findUser;