const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Teacher",
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "class",
    required: true,
  },
});

teacherSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Teacher = mongoose.models.teachers || mongoose.model("teacher", teacherSchema);
module.exports = Teacher;
