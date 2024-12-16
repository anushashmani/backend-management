const mongoose = require("mongoose");
const Course = require("./courseSchema");
const Teacher = require("./teacherSchema");
const Student = require("./studentSchema");

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
});

batchSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

batchSchema.pre("deleteOne", async function (next) {
  try {
    const batchId = this.getQuery()._id;
    Promise.all([
      Course.deleteMany({ batchId }),
      Teacher.deleteMany({ batchId }),
      Student.deleteMany({ batchId }),
    ]);

    next();
  } catch (err) {
    next(err);
  }
});

const Batch = mongoose.models.batch || mongoose.model("batch", batchSchema);

module.exports = Batch;
