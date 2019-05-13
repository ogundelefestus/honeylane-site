var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var studentSchema = new Schema({
    fullname : {type: String, required: true},
    class: {type: String, required: true},
    age: {type: String, required: true}
});


module.exports = mongoose.model('Student', studentSchema);