const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  name      : { type: String, required: true },
  email     : { type: String, required: true },
  password  : { type: String, required: true }
});

var Student = mongoose.model('students', StudentSchema);

module.exports = Student;