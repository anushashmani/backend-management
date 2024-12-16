const Batch = require("../models/batchSchema.js");

exports.add = async (req, res) => {
  try {
    const batch = new Batch({
      name: req.body.name,
      campusId: req.body.campusId,
    });

    const isExist = await Batch.findOne({
      name: req.body.name,
      campusId: req.body.campusId,
    });

    if (isExist) {
      res.status(404).send({ message: "Sorry this batch name already exists" });
    } else {
      let a = await batch.save();
      res.send({ message: "batch added.", data: a });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  const { campusId } = req.params;
  try {
    const batches = await Batch.find({ campusId });

    return res.send(batches);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  try {
    const batch = await Batch.findById(id).select("-campusId -_id");
    if (!batch) {
      return res.status(404).send({ message: "Batch not found" });
    }
    res.send(batch);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const batch = await Batch.deleteOne({ _id: id });
    if (!batch) {
      return res.status(404).send({ message: "Batch not found" });
    }
    res.send({ message: "Batch deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const batch = await Batch.findByIdAndUpdate(
      { _id: id },
      { name },
      { new: true, runValidators: true }
    );
    console.log(batch);
    if (!batch) {
      return res.status(404).send({ message: "Batch not found" });
    }
    res.send({ message: "Batch updated successfully", batch });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
