const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  name      : { type: String },
  email     : { type: String },
  password  : { type: String }
});

mongoose.model('students', StudentSchema);

//module.exports = Student;