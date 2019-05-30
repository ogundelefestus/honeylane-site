var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({
    student_id : {type: String },
    year : {type: String},
    subjects : [{type: String}],
    ca_score : [{type: String}],
    exam_score : [{type: String}],
    total : [{type: String}],
    remark : {type: String},
    school_opened : {type: String},
    student_present : {type : String},
    student_absent : {type: String}
});


module.exports = mongoose.model('Result', resultSchema);