var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var studentSchema = new Schema({
    fullname : {type: String, required: true},
    class: {type: String, required: true},
    age: {type: String, required: true},
    sex: {type: String, required: true},
    religion : {type: String, required: true},
    term_joined : {type: String, required: true},
    state_of_origin : {type: String, required: true}
});


module.exports = mongoose.model('Student', studentSchema);