var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

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
                    console.log("TOKEN 1")
                    if (!user.skills[0]) {
                        console.log("TOKEN 2 ");
                        user.skills = [];
                    }
                    console.log(user.skills);
                    if (err) reject(err);
                    else resolve(user);
                });
            });
    });
}

module.exports = listSkills;