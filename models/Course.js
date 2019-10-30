const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const CourseSchema = new Schema({
  title       : { type: String, required: true  },
  description : { type: String, required: true  },
  slug        : { type: String, required: true  },
  shareId     : { type: String, required: true  },
  instructor  : {
    type: ObjectId,
    ref: "users",
    required: true
  },
  modules     : [{
    title: {type: String},
    lessons: [{
      _id: ObjectId, 
      title: String,
      content: String
    }]
  }]
});

var Course = mongoose.model('courses', CourseSchema);

//module.exports = Course;