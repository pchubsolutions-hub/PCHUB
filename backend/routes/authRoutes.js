const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Admin = require("../models/Admin");

const router = express.Router();

let otpStore = {};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gmail transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    family: 4,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("GMAIL SMTP ERROR:", error);
  } else {
    console.log("GMAIL SMTP READY:", success);
  }
});

// Create admin automatically
router.post("/setup", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({
      username: process.env.ADMIN_USERNAME,
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    const admin = new Admin({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    await admin.save();

    res.json({
      message: "Admin account created successfully.",
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    res.status(500).json({
      message: "Failed to create admin.",
    });
  }
});



// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    otpStore[username] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };


    console.log("OTP SEND START");
console.log("GMAIL USER:", process.env.GMAIL_USER);
console.log("ADMIN EMAIL:", admin.email);
    // Send OTP
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: admin.email,
      subject: "PCHUB Admin Login OTP",
      text: `Your PCHUB Admin Login OTP is: ${otp}

This OTP will expire in 5 minutes.

If you did not request this OTP, please ignore this email.`,
    });

    res.json({
      success: true,
      message: "OTP sent to admin email.",
      username,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Unable to send OTP.",
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { username, otp } = req.body;

    const storedOTP = otpStore[username];

    if (!storedOTP) {
      return res.status(400).json({
        message: "OTP not found. Please login again.",
      });
    }

    if (Date.now() > storedOTP.expiresAt) {
      delete otpStore[username];

      return res.status(400).json({
        message: "OTP expired. Please login again.",
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    delete otpStore[username];

    const token = jwt.sign(
      {
        username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      success: true,
      message: "Admin login successful.",
      token,
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    res.status(500).json({
      message: "OTP verification failed.",
    });
  }
});

module.exports = router;