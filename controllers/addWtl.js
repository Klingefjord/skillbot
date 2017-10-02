'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const addUser = require('./addUser');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';
// @TODO make dbUrl connection string based on slack team name

function wantToLearn(inputUser, inputString) {
    const { filtered }  = Utils.removeLvlFromString(inputString);

    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        });        
    }).then((db) => {
        return new Promise((resolve, reject) => {
            db.collection('users').findOne({user_name: inputUser}, (err, user) => {
                if (err) reject(err);
                else {
                    // add user if user doesnt exist
                    if (!user) {
                        addUser(user).then((newUser) => {
                            let tempUser = addWtlToUser(newUser, filtered);
                            resolve({db, tempUser});
                        });
                    } else {
                        let tempUser = addWtlToUser(user, filtered);
                        resolve({db, tempUser});
                    }    
                }
            });
        });
    }).then(({db, tempUser}) => {
        return new Promise((resolve, reject) => {
            db.collection('users').findOneAndUpdate({user_name: tempUser.user_name}, {$set: tempUser}, (err, res) => {
                if (err) reject(err);
                else resolve(filtered);
                db.close();
            });
            // query array against other users
        });
    });
}

// helper function, pushes wtl and returns new user
function addWtlToUser(inputUser, wtl) {
    let tempUser = {
        user_name: inputUser.user_name,
        skills: inputUser.skills,
        wtl: inputUser.wtl
    }

    tempUser.wtl.push(wtl);
    return tempUser;
}

module.exports = wantToLearn;