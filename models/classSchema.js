const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  timing: {
    type: [String],
    required: true,
  },
  days: {
    type: [String],
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
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
});

classSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const ClassStudent =
  mongoose.models.class || mongoose.model("class", classSchema);

module.exports = ClassStudent;
