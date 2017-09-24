'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const addUser = require('./addUser');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';
// @TODO make dbUrl connection string based on slack team name

function addSkill(inputUser, inputText) {

    // make subarray out of input
    const pascalArr = Utils.toPascalCase(inputText);
    const { level, filtered } = Utils.removeLvlFromString(pascalArr);

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
                    if(!user) {
                        addUser(inputUser).then((insertedUser) => {
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
            db.collection('users').updateOne({user_name: inputUser}, {$set: updatedUser}, (err, res) => {
                if(err) reject(err);
                else resolve(`${filtered} added to your profile!`);
                db.close();
            }); 
        });
    });
}

module.exports = addSkill;