var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({
    student : {type: Schema.Types.ObjectId, ref: 'Student'},
    subjects : [{type: String}],
    ca_score : [{type: Number}],
    exam_score : [{type: Number}],
    total : [{type: Number}]
});


module.exports = mongoose.model('Result', resultSchema);