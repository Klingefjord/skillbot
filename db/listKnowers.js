const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

// @TODO make dbUrl connection string based on slack team name

function listKnowers(inputSkill, team_id) {
    const { filtered } = Utils.removeLvlFromString(inputSkill);
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    })
    .then((db) => {
        return new Promise((resolve, reject) => {
            console.log(filtered);
            db.collection(`${team_id}_users`).find({ skills: { $elemMatch: { skill: filtered } } }).toArray((err, doc) => {
                if (err) reject(err);
                resolve({ doc, filtered });
                db.close();
            });
        });
    });
}

module.exports = listKnowers;