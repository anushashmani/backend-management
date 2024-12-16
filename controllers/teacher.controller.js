const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Teacher = require("../models/teacherSchema.js");

const createHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const sendWelcomeEmail = async (name, email, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sshnaqvi2001@gmail.com",
      pass: "tzqw kbhb xrch uhqv",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "sshnaqvi2001@gmail.com",
    to: email,
    subject: "Welcome",
    text: `Hello ${name}, Your Login Details: \n
        Email: ${email} \n
        Password: ${password}`,
  };

  await transporter.sendMail(mailOptions);
};

const checkExistingTeacher = async (email) => {
  return await Teacher.findOne({ email });
};

const checkTeacherAssignment = async (batchId, courseId) => {
  return await Teacher.findOne({ batchId, courseId });
};

const saveTeacher = async (teacherData) => {
  const teacher = new Teacher(teacherData);
  let result = await teacher.save();
  result.password = undefined;
  return result;
};

exports.teacherRegister = async (req, res) => {
  const { name, email, password, campusId, batchId, courseId } = req.body;

  try {
    const existingTeacherByEmail = await checkExistingTeacher(email);
    if (existingTeacherByEmail) {
      return res.status(409).send({ message: "Email already exists" });
    }

    const existingTeacherAssignment = await checkTeacherAssignment(
      batchId,
      courseId
    );
    if (existingTeacherAssignment) {
      return res
        .status(409)
        .send({ message: "Teacher already assigned to this batch and course" });
    }

    const hashedPass = await createHashedPassword(password);
    const teacherData = {
      name,
      email,
      password: hashedPass,
      campusId,
      batchId,
      courseId,
    };

    await sendWelcomeEmail(name, email, password);

    const result = await saveTeacher(teacherData);
    res.status(201).send("Teacher added successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.teacherLogIn = async (req, res) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email })
      .populate("batchId")
      .populate("courseId")
      .populate("campusId");

    if (teacher) {
      const validated = await bcrypt.compare(
        req.body.password,
        teacher.password
      );
      if (validated) {
        teacher.password = undefined;
        const response = {
          role: teacher.role,
          name: teacher.name,
          email: teacher.email,
          batch: teacher.batchId,
          course: teacher.courseId,
          campus: teacher.campusId,
        };
        res.send(response);
      } else {
        res.send({ message: "Invalid Credentials" });
      }
    } else {
      res.send({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const { campusId } = req.params;
    let teachers = await Teacher.find({ campusId })
      .populate("courseId")
      .populate("batchId");

    if (teachers.length > 0) {
      let modifiedTeachers = teachers.map((teacher) => {
        return {
          id: teacher.id,
          name: teacher.name,
          course: teacher.courseId.name,
          batch: teacher.batchId.name,
        };
      });
      return res.send(modifiedTeachers);
    } else {
      res.send({ message: "No teachers found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTeacherDetail = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id)
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");
    if (teacher) {
      teacher.password = undefined;
      res.send(teacher);
    } else {
      res.send({ message: "No teacher found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateTeacherSubject = async (req, res) => {
  const { teacherId, teachSubject } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true }
    );

    await Subject.findByIdAndUpdate(teachSubject, {
      teacher: updatedTeacher._id,
    });

    res.send(updatedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    await Subject.updateOne(
      { teacher: deletedTeacher._id, teacher: { $exists: true } },
      { $unset: { teacher: 1 } }
    );

    res.send(deletedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeachers = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany({ school: req.params.id });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ school: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTeachersByClass = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany({
      sclassName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

const teacherAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.send({ message: "Teacher not found" });
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
