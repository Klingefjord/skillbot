'use strict';

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

// @TODO make dbUrl connection string based on slack team name

function listKnowers(inputSkill) {
    const { filtered } = Utils.removeLvlFromString(inputSkill);
    return new Promise((resolve, reject) => {
        mongo.connect(dbUrl, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        })
    })
    .then((db) => {
        return new Promise((resolve, reject) => {
            db.collection('users').find({ skills: { $elemMatch: { skill: filtered } } }).toArray((err, doc) => {
                // @TODO refine this query
                console.log(doc);
                if (err) reject(err);
                resolve(doc);
                db.close();
            });
        });
    });
}

module.exports = listKnowers;