const express = require("express");
const cors = require("cors");
require("dotenv").config();

const inquiryRoutes = require("./routes/inquiryRoutes");
const productRoutes = require("./routes/Product");
const authRoutes = require("./routes/authRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;



// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PCHUB Backend API is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `PCHUB Backend running on http://localhost:${PORT}`
  );
});