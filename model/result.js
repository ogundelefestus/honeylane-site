var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({
    student : {type: Schema.Types.ObjectId, ref: 'Student'},
    subject_scores: {type: {}}
});


module.exports = mongoose.model('Result', resultSchema);