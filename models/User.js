const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name      : { type: String },
  email     : { type: String },
  password  : { type: String },
  isTeacher : { type: Boolean, default: false },
  enrolled  : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses'
  }],
  tutored   : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses'
  }]
});

mongoose.model('users', UserSchema);

//module.exports = Student;