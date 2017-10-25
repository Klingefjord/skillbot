const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const findUserProfile = require('../user');
const Utils = require('../util/utils');
const addUser = require('./addUser');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

// @TODO make dbUrl connection string based on slack team name

function addSkill(inputText, inputUserId, team_id) {

    // make subarray out of input
    const { level, filtered } = Utils.removeLvlFromString(inputText);

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
                    if(!user) {
                        addUser(inputUserId, team_id).then((insertedUser) => {
                            console.log("user added!");
                            let updatedUser = insertedUser;
                            updatedUser.skills.push({ skill: filtered, lvl: level });                                                   
                            resolve({updatedUser, db}); 
                        });
                    } else {
                        let updatedUser = Object.assign({}, user);
                        updatedUser.skills.push({ skill: filtered, lvl: level });
                        resolve({ updatedUser, db });
                    }
                }
            });
        });
    }).then(({ updatedUser, db }) => {
        return new Promise((resolve, reject) => {
            db.collection(`${team_id}_users`).updateOne({user_name: updatedUser.user_name}, {$set: updatedUser}, (err, res) => {
                if(err) reject(err);
                else resolve(`${filtered} added to your profile!`);
                db.close();
            }); 
        });
    });
}

module.exports = addSkill;