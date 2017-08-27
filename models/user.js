var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    _id: {type: Schema.Types.ObjectId},
    name: {type: string, required: true},
    org: {type: Schema.Types.ObjectId, ref: 'Org'},
    skills: [{title: string, category: string, level, number}]
});