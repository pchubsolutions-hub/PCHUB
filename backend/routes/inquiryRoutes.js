const express = require("express");
const router = express.Router();

const Inquiry = require("../models/Inquiry");
const protectAdmin = require("../middleware/authMiddleware");


// ===============================
// CREATE INQUIRY
// ===============================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const inquiry = new Inquiry({
      name,
      email,
      phone,
      subject,
      message,
    });

    const savedInquiry = await inquiry.save();

    res.status(201).json({
      message: "Inquiry submitted successfully.",
      inquiry: savedInquiry,
    });
  } catch (error) {
    console.error("Inquiry create error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

// ===============================
// GET ALL INQUIRIES
// ===============================

router.get("/", protectAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({
      createdAt: -1,
    });

    res.json(inquiries);
  } catch (error) {
    console.error("Inquiry fetch error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

// ===============================
// DELETE INQUIRY
// ===============================

router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(
      req.params.id
    );

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found.",
      });
    }

    res.json({
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Inquiry delete error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

// ===============================
// MARK AS READ
// ===============================

router.put("/:id/read", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: "Read",
      },
      {
        new: true,
      }
    );

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found.",
      });
    }

    res.json(inquiry);
  } catch (error) {
    console.error("Inquiry update error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

module.exports = router;
