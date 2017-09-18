'use strict'
const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/skillbasedb';

function updateSkill(inputUser, inputSkill) {

}

module.exports = updateSkill;