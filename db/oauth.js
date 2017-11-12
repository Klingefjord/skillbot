const mongo = require('mongodb').MongoClient;
const Utils = require('../util/utils');
require('dotenv').config();
const dbUrl = process.env.DB_URL;

const oauth = {
    get(team_id) {
        return new Promise((resolve, reject) => {
            mongo.connect(dbUrl, (err, db) => {
                if (err) reject(err);
                else resolve(db)
            })
        }).then((db) => {
            return new Promise((resolve, reject) => {
                db.collection('tokens').findOne({team_id: team_id}, (err, tokenObject) => {
                    if (err) reject(err);
                    else resolve(tokenObject.token)
                });
            });
        });
    },

    set(team_id, token) {
        return new Promise((resolve, reject) => {
            mongo.connect(dbUrl, (err, db) => {
                if (err) reject(err);
                else resolve(db)
            })
        }).then((db) => {
            return new Promise((resolve, reject) => {
                db.collection('tokens').insert({team_id: team_id, token: token}, (err, res) => {
                    if (err) reject(err);
                    else resolve(res)
                });
            });
        });
    }
}

module.exports = oauth;