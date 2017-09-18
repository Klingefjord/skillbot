var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var dbUrl = process.env.DB_URL;

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
                    console.log(user + " named " + user.user_name);
                    if (err) reject(err);
                    else resolve(user);
                });
            });
    });
}

module.exports = listSkills;