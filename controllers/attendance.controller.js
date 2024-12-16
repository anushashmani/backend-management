const Attendance = require("../models/attendance.schema");
const { startOfDay, endOfDay, startOfMonth, endOfMonth } = require('date-fns');

exports.addDaily = async (req, res) => {
    console.log(req.body);
    const { Id, date, attendanceStatus,time } = req.body;
  
    if (!Id || !date || !attendanceStatus) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check if attendance already exists for the user on the given date
      const existingAttendance = await Attendance.findOne({ userId: Id, date });
  
      if (existingAttendance) {
        return res.status(400).json({ message: "Attendance already marked for this date" });
      }
  
      const attendance = new Attendance({
        userId: Id,
        date,
        time,
        attendance: attendanceStatus,
      });
      await attendance.save();
      res.status(201).json({message:"Attendance record added successfully"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error adding attendance record", error });
    }
  };
  
  exports.getDailyAttendance = async (req, res) => {
    const {date} = req.query
    try {
      const attendanceRecords = await Attendance.find({date})
      .populate({
        path: 'userId',
        select: ['name', 'rollNum'],
        populate: [
          { path: 'batchId', select: 'name' },
          { path: 'courseId', select: 'name' }
        ]
      });
  
      if (attendanceRecords.length === 0) {
        return res.status(404).json({ message: `No attendance records found for Today` });
      }
  
      let modifiedArray = attendanceRecords.map((item) => {
        return {
          id: item._id,
          rollNum: item.userId.rollNum,
          name: item.userId.name,
          batch: item.userId.batchId.name,
          course: item.userId.courseId.name,
          attendance: item.attendance,
          time:item.time
        };
      });
  
      res.status(200).json(modifiedArray);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching attendance records", error });
    }
  };
  
  exports.getStudentMonthlyAttendance = async (req, res) => {
    const { studentId, monthIndex } = req.query;
  
    if (!studentId || !monthIndex) {
      return res.status(400).json({ message: "Student ID and month index are required" });
    }
  
    try {
      const currentYear = new Date().getFullYear();
  
      const attendanceRecords = await Attendance.find({
        userId: studentId
      });
  
      const filteredRecords = attendanceRecords.filter(record => {
        const [day, month, year] = record.date.split('/') ;
        return month == monthIndex && year == currentYear;
      });
  
      if (filteredRecords.length === 0) {
        return res.status(404).json({ message: `No attendance records found for month ${monthIndex} of the current year` });
      }
  
      const modifiedArray = filteredRecords.map(item => {
        return {
          id: item._id,
          date: item.date,
          attendance: item.attendance,
          time: item.time
        };
      });
  
      res.status(200).json(modifiedArray);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching attendance records", error });
    }
  };
