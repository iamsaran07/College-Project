const express = require("express");
const path = require("path");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const pdf = require('html-pdf');
const Contact = require("../models/contactModel");
const Student = require("../models/studentModel");
const studentFee = require("../models/feesModel");
const authFile = require("../middleware/auth");
const Image = require("../models/imageModel");
const app = express();
const puppeteer = require('puppeteer');
const { verify } = require("jsonwebtoken");
app.use(express.static(path.join(__dirname, "../Images")));

app.use(express.static("Images"));

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.set("view engine", "hbs");
const viewPath = path.join(__dirname, "../view");
app.set("views", viewPath);

exports.dashboard = async (req, res) => {
  res.render("admin");
};

exports.studentProfile = async (req, res) => {
  res.render("studentProfile");
};

exports.register = async (req, res) => {
  res.render("register");
};

exports.announcement = async (req, res) => {
  res.render("announcement");
};

exports.commonAnnouncement = async (req, res) => {
  res.render("commonAnnouncement");
};

exports.paymentAlert = async (req, res) => {
  res.render("paymentAlert");
};

exports.updateDueDatesForAll = async (req, res) => {
  res.render("dueDate");
};

exports.feeRegister = async (req, res) => {
  res.render("feeRegister");
};

exports.message = async (req, res) => {
  try {
    const messages = await Contact.find();
    res.render("message", { messages });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.studentList = async (req, res) => {
  try {
    const allStudents = await Student.find({ isDelete: false });
    const firstYearStudents = allStudents.filter(
      (student) => student.year === "I"
    );
    const secondYearStudents = allStudents.filter(
      (student) => student.year === "II"
    );

    res.render("studentList", { firstYearStudents, secondYearStudents });
  } catch (err) {
    console.error(err);
    res.send("Error", err);
  }
};

exports.studentEdit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const student = await Student.findById(userId);
    res.render("studentEdit", { student });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.studentFeeList = async (req, res) => {
  try {
    const allStudents = await Student.find({ isDelete: false });
    const firstYearStudents = allStudents.filter(
      (student) => student.year === "I"
    );
    const secondYearStudents = allStudents.filter(
      (student) => student.year === "II"
    );

    res.render("studentFeeList", { firstYearStudents, secondYearStudents });
  } catch (err) {
    console.error(err);
    res.send("Error", err);
  }
};

exports.examFeeList = async (req, res) => {
  try {
    const allStudents = await Student.find({ isDelete: false });
    const firstYearStudents = allStudents.filter(
      (student) => student.year === "I"
    );
    const secondYearStudents = allStudents.filter(
      (student) => student.year === "II"
    );

    res.render("examFeeList", { firstYearStudents, secondYearStudents });
  } catch (err) {
    console.error(err);
    res.send("Error", err);
  }
};

exports.examFeeEdit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const fee = await Student.findById(userId);
    res.render("examFeeEdit", { fee });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.feeEdit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const fee = await Student.findById(userId);
    res.render("feeEdit", { fee });
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
};

exports.gallery = async (req, res) => {
  try {
    const images = await Image.find({});
    res.render("gallery", { images });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

exports.getStudentDetails = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  try {
    const decodedToken = await verify(
      accessToken,
      "mnbvcxzlkjhgfdsapoiuytrewq"
    );
    const studentId = decodedToken.studentId;

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.send(
        '<script>alert("Student not Found!"); window.location.href = "/ssm/mca/studentLogin";</script>'
      );
    }

    res.render("studentProfile", { student });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).send("Failed to fetch user details");
  }
};

exports.downloadFirstYrTuFeePDF = async (req, res) => {
  try {
    const firstYearStudents = await Student.find({ year: 'I', isDelete: false });

    const templateHTML = await generateTemplate(firstYearStudents);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(templateHTML);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

async function generateTemplate(firstYearStudents) {
  return new Promise((resolve, reject) => {
    res.render('firstYearTuitionFeeTemplate', { firstYearStudents }, (err, html) => {
      if (err) {
        console.error(err);
        reject('Error rendering template');
      } else {
        resolve(html);
      }
    });
  });
}

exports.downloadSecondYrTuFeePDF = async (req, res) => {
  try {
    const secondYearStudents = await Student.find({ year: 'II', isDelete: false });

    const templateHTML = await generateTemplate(secondYearStudents);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(templateHTML);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

async function generateTemplate(firstYearStudents) {
  return new Promise((resolve, reject) => {
    res.render('secondYearTuitionFeeTemplate', { secondYearStudents }, (err, html) => {
      if (err) {
        console.error(err);
        reject('Error rendering template');
      } else {
        resolve(html);
      }
    });
  });
}

exports.downloadFirstYrExFeePDF = async (req, res) => {
  try {
    const firstYearStudents = await Student.find({ year: 'I', isDelete: false });

    const templateHTML = await generateTemplate(firstYearStudents);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(templateHTML);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

async function generateTemplate(firstYearStudents) {
  return new Promise((resolve, reject) => {
    res.render('firstYearExamFeeTemplate', { firstYearStudents }, (err, html) => {
      if (err) {
        console.error(err);
        reject('Error rendering template');
      } else {
        resolve(html);
      }
    });
  });
}

exports.downloadSecondYrExFeePDF = async (req, res) => {
  try {
    const secondYearStudents = await Student.find({ year: 'II', isDelete: false });

    const templateHTML = await generateTemplate(secondYearStudents);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(templateHTML);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

async function generateTemplate(firstYearStudents) {
  return new Promise((resolve, reject) => {
    res.render('secondYearExamFeeTemplate', { secondYearStudents }, (err, html) => {
      if (err) {
        console.error(err);
        reject('Error rendering template');
      } else {
        resolve(html);
      }
    });
  });
}


module.exports = exports;
