const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
  //instructor  : { type: String, required: true  },
  term        : { type: String, required: false },
  title       : { type: String, required: true  },
  description : { type: String, required: true }
});

var Course = mongoose.model('Courses', CourseSchema);

module.exports = Course;