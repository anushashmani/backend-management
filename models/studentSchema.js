const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    rollNum: {
        type: Number,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // required: true
    },
    QRCode:{
        type: String,
        // required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class',
        required: true,
    },
    campusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
});

studentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

const Student = mongoose.models.students || mongoose.model("student", studentSchema);

module.exports = Student