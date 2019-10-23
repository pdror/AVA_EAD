const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name      : { type: String },
  email     : { type: String },
  password  : { type: String },
  isTeacher : { type: Boolean, default: false }
});

mongoose.model('users', UserSchema);

//module.exports = Student;