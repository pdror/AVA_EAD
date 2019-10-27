const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const CourseSchema = new Schema({
  //instructor  : { type: ObjectId(""), required: true  },
  term        : { type: String, required: false },
  title       : { type: String, required: true  },
  description : { type: String, required: true  },
  slug        : { type: String, required: true  },
  quickId     : { type: String, required: true  },
  instructor  : {
    instructorId : { type: ObjectId, required: true },
    name         : { type: String, required: true },
    email        : { type: String, required: true }
  }
});

var Course = mongoose.model('courses', CourseSchema);

//module.exports = Course;