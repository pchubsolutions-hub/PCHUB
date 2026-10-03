const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const Admin = require("../models/Admin");

const router = express.Router();

let otpStore = {};

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==================================================
// CREATE ADMIN
// ==================================================

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
      success: true,
      message: "Admin account created successfully.",
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    res.status(500).json({
      message: "Failed to create admin.",
    });
  }
});

// ==================================================
// LOGIN
// ==================================================

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    // Check password
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

    // Store OTP
    otpStore[username] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    console.log("=================================");
    console.log("OTP SEND START");
    console.log("ADMIN USERNAME:", username);
    console.log("ADMIN EMAIL:", process.env.ADMIN_EMAIL);
    console.log("=================================");

    // ==================================================
    // SEND OTP USING RESEND
    // ==================================================

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL,
      subject: "PCHUB Admin Login OTP",
      text: `Your PCHUB Admin Login OTP is: ${otp}

This OTP will expire in 5 minutes.

If you did not request this OTP, please ignore this email.`,
    });

    // Resend error
    if (error) {
      console.error("RESEND EMAIL ERROR:", error);

      return res.status(500).json({
        message: "Unable to send OTP.",
      });
    }

    console.log("OTP EMAIL SENT SUCCESSFULLY");
    console.log("RESEND RESPONSE:", data);

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

// ==================================================
// VERIFY OTP
// ==================================================

router.post("/verify-otp", async (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({
        message: "Username and OTP are required.",
      });
    }

    const storedOTP = otpStore[username];

    if (!storedOTP) {
      return res.status(400).json({
        message: "OTP not found. Please login again.",
      });
    }

    // Check expiry
    if (Date.now() > storedOTP.expiresAt) {
      delete otpStore[username];

      return res.status(400).json({
        message: "OTP expired. Please login again.",
      });
    }

    // Check OTP
    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    // Delete used OTP
    delete otpStore[username];

    // Create JWT
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