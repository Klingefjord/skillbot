var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/skillbasedb';

function addSkill(inputUser, inputText) {
    function toPascalCase(s) {
        return (
            s.replace(/(\w)(\w*)/g, 
            function(g0,g1,g2) {
                return g1.toUpperCase() + g2.toLowerCase();
            })
        );
    }

    // make subarray out of input
    let pascalArr = toPascalCase(inputText).split(' ');
    let level = undefined;

    let filtered = pascalArr.filter((v) => {
        // remove number and store in level
        if (!isNaN(v)) {
            level = v;
            return false;
        }
        // remove 'level' or 'lvl' from array if it is there
        if (v.match(/(Lvl|Level)/g)) {
            return false;
        }
        return true;
    }).join(' ');

    mongo.connect(dbUrl, (err, db) => {
        assert.equal(null, err);
        db.collection('users').findOne({user_name: inputUser}, (err, user) => {
            if (!user) {
                let tempUser = {
                    user_name: inputUser,
                    skills: [{ skill: filtered, lvl: level }]
                };

                db.collection('users').insertOne(tempUser, (err, res) => {
                    assert.equal(null, err);
                    console.log('item inserted!');
                    db.close();
                });  
            } else {
                let updatedUser = user.skills.push({ skill: filtered, lvl: level });
                db.collection('users').updateOne({user_name: inputUser}, {$set: updatedUser}, (err, res) => {
                    assert.equal(null, err);
                    db.close();
                });
            }
        });
    });
}

module.exports = addSkill;