const Complain = require('../models/complainSchema.js');

const complainCreate = async (req, res) => {
    try {
        const complain = new Complain(req.body)
        const result = await complain.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
           return res.send({ message: "No complains found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList };
