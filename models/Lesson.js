var mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

var LessonSchema = Schema({
  moduleId     : { type: String, required: false, red: "modules" },
  title        : { type: String, required: true  },
  content      : { type: String, required: true  }
});

var Lesson = mongoose.model('lessons', LessonSchema);

//module.exports = Lesson;