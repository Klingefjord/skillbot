const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const addUser = require('./addUser');
const checkForMatch = require('./checkForMatch');
require('dotenv').config();
const dbUrl = process.env.DB_URL;
// @TODO make dbUrl connection string based on slack team name

function wantToLearn(inputString, inputUserId, team_id) {
    const { filtered }  = Utils.removeLvlFromString(inputString);

    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        });        
    }).then((db) => {
        return new Promise((resolve, reject) => {
            db.collection(`${team_id}_users`).findOne({user_id: inputUserId}, (err, user) => {
                if (err) reject(err);
                else {
                    // add user if user doesnt exist
                    if (!user) {
                        addUser(inputUserId, team_id).then((newUser) => {
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
            db.collection(`${team_id}_users`).findOneAndUpdate({user_id: tempUser.user_id}, {$set: tempUser}, (err, res) => {
                if (err) reject(err);
                else resolve({tempUser, filtered});

                // check for match immediately when new wtl is added
                db.close();
            });
        });
    });
}

// helper function, pushes wtl and returns new user
function addWtlToUser(inputUser, wtl) {
    let tempUser = {
        user_name: inputUser.user_name,
        skills: inputUser.skills,
        user_id: inputUser.user_id,
        wtl: inputUser.wtl
    }

    tempUser.wtl.push(wtl);
    return tempUser;
}

module.exports = wantToLearn;