const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

const ModuleSchema = new Schema({
  courseId    : { type: ObjectId, required: true, ref: "courses" },
  title       : { type: String, required: true  },
  lessons : [{
    title: String,
    content: String
  }]
});

var Module = mongoose.model('modules', ModuleSchema);