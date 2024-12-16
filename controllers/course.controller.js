const Course = require("../models/courseSchema.js");

exports.add = async (req, res) => {
  const { batchId, campusId } = req.body;
  try {
    const isExist = await Course.findOne({
      batchId,
      campusId,
      name: req.body.name,
    });

    if (isExist) {
      return res.status(409).send({
        message: "Course with the same batchId and campusId already exists",
      });
    }
    const course = new Course({
      ...req.body,
    });
    await course.save();
    res.status(201).send({ message: "Course added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getAll = async (req, res) => {
  const { campusId } = req.params;
  try {
    const courses = await Course.find({ campusId })
      .select("-campusId")
      .populate("batchId");

    const updatedArray = courses.map((e) => {
      return {
        id: e.id,
        name: e.name,
        batch: e.batchId.name,
      };
    });
    res.send(updatedArray);
    console.log("updatedArray", courses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    res.send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, batchId, campusId } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(
      id,
      { name, batchId, campusId },
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    res.send({ message: "Course updated successfully", course });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.deleteOne({ _id: id });
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    res.send({ message: "Course deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getFilteredCourses = async (req, res) => {
  const { batchId } = req.params;
  try {
    let filteredCourse = await Course.find({ batchId });
    return res.send(filteredCourse);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
