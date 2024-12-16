const router = require("express").Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
} = require("../controllers/admin-controller.js");

const batchController = require("../controllers/batch.controller.js");
const {
  complainCreate,
  complainList,
} = require("../controllers/complain-controller.js");
// const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const studentController = require("../controllers/student.controller.js");
const attendanceController = require("../controllers/attendance.controller.js");
const courseController = require("../controllers/course.controller.js");
const teacherController = require("../controllers/teacher.controller.js");
const classController = require("../controllers/class.controller.js");

// Admin
router.post("/AdminReg", adminRegister);
router.post("/api/AdminLogin", adminLogIn);
router.get("/Admin/:id", getAdminDetail);
// router.delete("/Admin/:id", deleteAdmin)

// Student
router.post("/StudentReg", studentController.signup);
router.post("/studentLogin", studentController.login);
router.get("/getStudents/:campusId", studentController.get);

// Teacher

router.post("/TeacherReg", teacherController.teacherRegister);
// router.post('/TeacherLogin', teacherLogIn)
router.get("/getAllTeachers/:campusId", teacherController.getTeachers);

// Complain
router.post("/ComplainCreate", complainCreate);
router.get("/ComplainList", complainList);

//Attendance
router.post("/addDailyAttendance", attendanceController.addDaily);
router.get("/getDailyAttendance", attendanceController.getDailyAttendance);
router.get(
  "/attendance/student-monthly-attendance",
  attendanceController.getStudentMonthlyAttendance
);

// batch
router.post("/api/addBatch", batchController.add);
router.get("/getAllBatch/:campusId", batchController.getAll);
router.get("/getSingleBatch/:id", batchController.getSingle);
router.delete("/deleteBatch/:id", batchController.delete);
router.patch("/updateBatch/:id", batchController.update);
// router.get("/batch/:id", getbatchDetail)

// class
router.post("/addClass", classController.add);
router.get("/getClasses/:campusId", classController.getAll);

// Course
router.post("/addCourse", courseController.add);
router.get("/getAllCourse/:campusId", courseController.getAll);
router.get("/getSingleCourse/:id", courseController.getSingle);
router.delete("/deleteCourse/:id", courseController.delete);
router.patch("/updateCourse/:id", courseController.update);
router.get("/getFilteredCourses/:batchId", courseController.getFilteredCourses);

module.exports = router;
