const mongoose = require("mongoose");

const invoiceCounterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      default: "invoice",
    },

    sequence: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InvoiceCounter",
  invoiceCounterSchema
);