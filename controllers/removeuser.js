'use strict'

const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const Utils = require('../util/utils');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

function removeUser(inputUser) {
    mongo.connect(dbUrl, (err, db) => {
        db.collection('user').remove({user_name: inputUser}, true, (err, user) => {
            assert.equal(null, err);
        });
    });
}

module.exports = removeUser;