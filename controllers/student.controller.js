const bcrypt = require("bcrypt");
const Student = require("../models/studentSchema.js");
const qrcode = require("qrcode");
const nodemailer = require("nodemailer");

const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const findHighestRollNum = async () => {
  try {
    const highestRollStudent = await Student.find()
      .sort({ rollNum: -1 })
      .limit(1);

    return highestRollStudent.length > 0 ? highestRollStudent[0].rollNum : 0;
  } catch (err) {
    console.error("Error finding highest roll number:", err);
    return 0;
  }
};

const sendWelcomeEmail = async (email, name, newRollNum, password) => {
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
        Name: ${name} \n
        Email: ${email} \n
        Roll number: ${newRollNum} \n
        Password: ${password}`,
  };

  await transporter.sendMail(mailOptions);
};

const generateQRCode = async (student) => {
  const qrCodeData = await qrcode.toDataURL(
    JSON.stringify({
      Id: student._id.toString(),
      name: student.name,
      email: student.email,
      rollNum: student.rollNum,
    })
  );
  return qrCodeData;
};

const studentExists = async (email) => {
  return Student.findOne({ email });
};

// Signup controller
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingStudent = await studentExists(email);
    if (existingStudent) {
      return res.status(409).json({ message: "Student already exists" });
    }

    // Generate hashed password
    const hashedPass = await generateHashedPassword(password);

    // Find new roll number
    const newRollNum = await findHighestRollNum();
    console.log(newRollNum);
    // return

    // Create new student instance
    const student = new Student({
      ...req.body,
      rollNum: newRollNum + 1,
      QRCode: "",
      password: hashedPass,
    });

    // Send welcome email asynchronously (non-blocking)

    // Save student to database
    let savedStudent = await student.save();

    // Generate QR code
    savedStudent.QRCode = await generateQRCode(savedStudent);

    // Save student again with QR code
    let data = await savedStudent.save();

    data.password = undefined; // Remove password from response
    data.image = undefined; // Remove password from response
    data.QRCode = undefined;

    sendWelcomeEmail(email, name, newRollNum, password).catch((err) => {
      console.error("Error sending welcome email:", err);
    });
    
    res.send({ message: "Student Registered.", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { rollNum, password } = req.body;

  try {
    const student = await Student.findOne({ rollNum });
    if (!student) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    student.password = undefined;
    res.send({
      message: "Login successful.",
      data: student,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.get = async (req, res) => {
  const { campusId } = req.params;
  try {
    const students = await Student.find({ campusId });
    return res.send(students);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
