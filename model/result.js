var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({
    student_id : {type: String, require: true },
    year : {type: String},
    subjects : [{type: String}],
    ca_score : [{type: Number}],
    exam_score : [{type: Number}],
    ca_average: {type: Number, require: true},
    exam_average: {type: Number, require: true},
    total_average: {type:Number, require: true},
    total : [{type: Number}],
    grade : [{type: String}],
    remark : {type: String},
    school_opened : {type: String},
    student_present : {type : String},
    student_absent : {type: String}
});


module.exports = mongoose.model('Result', resultSchema);