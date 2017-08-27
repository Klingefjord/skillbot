var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SkillSchema = Schema({
    _id: {type: Schema.Types.ObjectId},
    name: {type: string, required: true},
    category: string
});