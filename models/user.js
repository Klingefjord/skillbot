let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    user_name: {typeof: String, required: true},
    skills: {typeof: Array, required: false}
});

model.exports = mongoose.model('User', schema);

