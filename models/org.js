var mongoose = require('mongoose');
var schema = mongoose.Schema;

var org = new Schema({
    name: {type: string, required: true},
    id: {type: string, required: true},
    users: [{type: Schema.ObjectId, ref: 'user'}]
});