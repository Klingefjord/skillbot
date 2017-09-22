'use strict'

var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var Utils = require('../util/utils');
var addUser = require('./addUser');
var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';
// @TODO make dbUrl connection string based on slack team name

function addSkill(inputUser, inputText) {
    // make subarray out of input
    const pascalArr = Utils.toPascalCase(inputText);
    const {level, filtered} = Utils.removeLvlFromString(pascalArr);

    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            console.log("first promise");
            if (err) reject(err);
            else resolve(db);
        });
    }).then((db) => {
        return new Promise((resolve, reject) => {
            db.collection('users').findOne({user_name: inputUser}, (err, user) => {
                console.log("second promise");
                console.log(user);
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
                        resolve({updatedUser, db});
                    }
                }
            });
        });
    }).then(({updatedUser, db}) => {
        return new Promise((resolve, reject) => {
            db.collection('users').updateOne({user_name: inputUser}, {$set: updatedUser}, (err, res) => {
                if(err) reject(err);
                else resolve(`${filtered} added to your profile!`);
            }); 
        });
    });
}

module.exports = addSkill;