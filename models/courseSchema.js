const mongoose = require("mongoose");
const Teacher = require("./teacherSchema");
const Student = require("./studentSchema");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "batch",
    required: true,
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
});

courseSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

courseSchema.pre("deleteOne", async function (next) {
  try {
    const courseId = this.getQuery()._id;
    Promise.all([
      Teacher.deleteMany({ courseId }),
      Student.deleteMany({ courseId }),
    ]);

    next();
  } catch (err) {
    next(err);
  }
});

const Course =
  mongoose.models.courses || mongoose.model("course", courseSchema);

module.exports = Course;
