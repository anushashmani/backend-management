const Class = require("../models/classSchema.js");

exports.add = async (req, res) => {
  try {
    const studentClass = new Class({
      ...req.body,
    });
    console.log("req", studentClass);

    await studentClass.save();
    res.send(studentClass);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAll = async (req, res) => {
  const { campusId } = req.params;
  try {
    const classes = await Class.find({ campusId })
    .populate("batchId")
    .populate("courseId")
      .select("-campusId")
      
    const updatedArray = classes.map((e) => {
      return {
        id: e.id,
        name: e.name,
        batch: e.batchId.name,
        course: e.courseId.name,
        days:e.days,
        timing:e.timing
      };
    });
      return res.send(updatedArray);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
