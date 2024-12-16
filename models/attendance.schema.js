const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'student',  // Assuming you have a User model
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  attendance: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
    default:'Absent'
  },
}, {
  timestamps: true,
});

const Attendance = mongoose.models.attendance || mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
