const express = require("express");
const InvoiceCounter = require("../models/InvoiceCounter");
const Invoice = require("../models/Invoice");
const protectAdmin = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const router = express.Router();


// =====================================================
// GET NEXT INVOICE NUMBER
// GET /api/invoices/next-number
// =====================================================

router.get("/next-number", protectAdmin, async (req, res) => {
  try {
    const counter = await InvoiceCounter.findOneAndUpdate(
      { name: "invoice" },
      { $inc: { sequence: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const invoiceNumber = `PCHUB-${String(
      counter.sequence
    ).padStart(6, "0")}`;

    res.json({
      success: true,
      invoiceNumber,
    });
  } catch (error) {
    console.error(
      "Invoice number generation error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate invoice number.",
    });
  }
});


// =====================================================
// GET ALL INVOICES
// GET /api/invoices
// =====================================================

router.get("/", protectAdmin, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Invoice fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices.",
    });
  }
});


// =====================================================
// SAVE INVOICE
// POST /api/invoices
// =====================================================

// =====================================================
// CREATE INVOICE + STOCK UPDATE
// MongoDB Transaction
// =====================================================

router.post("/", protectAdmin, async (req, res) => {
  const session = await Invoice.startSession();

  try {
    session.startTransaction();

    const {
      invoiceNumber,
      date,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      subtotal,
      totalDiscount,
      total,
      paymentStatus,
      notes,
    } = req.body;

    // ---------------------------------------
    // Validation
    // ---------------------------------------

    if (!invoiceNumber) {
      throw new Error("Invoice number is required.");
    }

    if (!customerName) {
      throw new Error("Customer name is required.");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("At least one invoice item is required.");
    }


    // ---------------------------------------
    // Check stock
    // ---------------------------------------

    for (const item of items) {

      if (!item.productId) {
        continue;
      }

      const quantity = Number(item.quantity || 0);

      if (quantity <= 0) {
        throw new Error(
          `Invalid quantity for ${item.product}.`
        );
      }

      const product = await Product.findById(
        item.productId
      ).session(session);

      if (!product) {
        throw new Error(
          `Product not found: ${item.product}`
        );
      }

      if (product.stock < quantity) {
        throw new Error(
          `Not enough stock for ${product.name}. ` +
          `Available: ${product.stock}, ` +
          `Requested: ${quantity}`
        );
      }
    }


    // ---------------------------------------
    // Reduce stock
    // ---------------------------------------

    for (const item of items) {

      if (!item.productId) {
        continue;
      }

      const quantity = Number(item.quantity || 0);

      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -quantity,
          },
        },
        {
          new: true,
          session,
        }
      );
    }


    // ---------------------------------------
    // Create invoice
    // ---------------------------------------

    const invoice = new Invoice({
      invoiceNumber,
      date: date || new Date(),
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      subtotal,
      totalDiscount,
      total,
      paymentStatus,
      notes,
    });

    await invoice.save({ session });


    // ---------------------------------------
    // Everything successful
    // ---------------------------------------

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message:
        "Invoice saved and stock updated successfully.",
      invoice,
    });

  } catch (error) {

    // ---------------------------------------
    // Something failed
    // ---------------------------------------

    await session.abortTransaction();

    console.error(
      "Invoice transaction error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message ||
        "Failed to save invoice.",
    });

  } finally {

    await session.endSession();
  }
});


// =====================================================
// GET SINGLE INVOICE
// GET /api/invoices/:id
// =====================================================

router.get("/:id", protectAdmin, async (req, res) => {
  try {

    const invoice = await Invoice.findById(
      req.params.id
    );


    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }


    res.json({
      success: true,
      invoice,
    });

  } catch (error) {

    console.error(
      "Single invoice fetch error:",
      error
    );


    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice.",
      error: error.message,
    });
  }
});


// =====================================================
// UPDATE INVOICE
// PUT /api/invoices/:id
// =====================================================

// =====================================================
// UPDATE INVOICE + STOCK
// MongoDB Transaction
// =====================================================

router.put("/:id", protectAdmin, async (req, res) => {
  const session = await Invoice.startSession();

  try {
    session.startTransaction();

    const invoiceId = req.params.id;

    const {
      date,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      subtotal,
      totalDiscount,
      total,
      paymentStatus,
      notes,
    } = req.body;

    // ---------------------------------------
    // Validation
    // ---------------------------------------

    if (!customerName) {
      throw new Error("Customer name is required.");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error(
        "At least one invoice item is required."
      );
    }

    // ---------------------------------------
    // Find existing invoice
    // ---------------------------------------

    const existingInvoice = await Invoice.findById(
      invoiceId
    ).session(session);

    if (!existingInvoice) {
      throw new Error("Invoice not found.");
    }

    // ---------------------------------------
    // STEP 1
    // Restore stock from OLD invoice
    // ---------------------------------------

    for (const oldItem of existingInvoice.items) {

      if (!oldItem.productId) {
        continue;
      }

      const oldQuantity = Number(
        oldItem.quantity || 0
      );

      if (oldQuantity <= 0) {
        continue;
      }

      await Product.findByIdAndUpdate(
        oldItem.productId,
        {
          $inc: {
            stock: oldQuantity,
          },
        },
        {
          session,
        }
      );
    }

    // ---------------------------------------
    // STEP 2
    // Check stock for NEW invoice
    // ---------------------------------------

    for (const newItem of items) {

      if (!newItem.productId) {
        continue;
      }

      const newQuantity = Number(
        newItem.quantity || 0
      );

      if (newQuantity <= 0) {
        throw new Error(
          `Invalid quantity for ${newItem.product}.`
        );
      }

      const product = await Product.findById(
        newItem.productId
      ).session(session);

      if (!product) {
        throw new Error(
          `Product not found: ${newItem.product}`
        );
      }

      if (product.stock < newQuantity) {
        throw new Error(
          `Not enough stock for ${product.name}. ` +
          `Available: ${product.stock}, ` +
          `Requested: ${newQuantity}`
        );
      }
    }

    // ---------------------------------------
    // STEP 3
    // Reduce stock for NEW invoice
    // ---------------------------------------

    for (const newItem of items) {

      if (!newItem.productId) {
        continue;
      }

      const newQuantity = Number(
        newItem.quantity || 0
      );

      await Product.findByIdAndUpdate(
        newItem.productId,
        {
          $inc: {
            stock: -newQuantity,
          },
        },
        {
          session,
        }
      );
    }

    // ---------------------------------------
    // STEP 4
    // Update invoice
    // ---------------------------------------

    existingInvoice.date = date || existingInvoice.date;
    existingInvoice.customerName = customerName;
    existingInvoice.customerPhone = customerPhone;
    existingInvoice.customerEmail = customerEmail;
    existingInvoice.customerAddress = customerAddress;
    existingInvoice.items = items;
    existingInvoice.subtotal = subtotal;
    existingInvoice.totalDiscount = totalDiscount;
    existingInvoice.total = total;
    existingInvoice.paymentStatus = paymentStatus;
    existingInvoice.notes = notes;

    await existingInvoice.save({
      session,
    });

    // ---------------------------------------
    // STEP 5
    // Commit transaction
    // ---------------------------------------

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Invoice updated successfully.",
      invoice: existingInvoice,
    });

  } catch (error) {

    // ---------------------------------------
    // Rollback everything
    // ---------------------------------------

    await session.abortTransaction();

    console.error(
      "Invoice update transaction error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update invoice.",
    });

  } finally {

    await session.endSession();
  }
});


// =====================================================
// DELETE INVOICE
// DELETE /api/invoices/:id
// =====================================================

// =====================================================
// DELETE INVOICE + RESTORE STOCK
// MongoDB Transaction
// =====================================================

router.delete("/:id", protectAdmin, async (req, res) => {
  const session = await Invoice.startSession();

  try {
    session.startTransaction();

    const invoiceId = req.params.id;

    // ---------------------------------------
    // STEP 1
    // Find invoice
    // ---------------------------------------

    const invoice = await Invoice.findById(
      invoiceId
    ).session(session);

    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    // ---------------------------------------
    // STEP 2
    // Restore stock
    // ---------------------------------------

    for (const item of invoice.items) {

      // Product ID නැත්නම් skip
      if (!item.productId) {
        continue;
      }

      const quantity = Number(
        item.quantity || 0
      );

      if (quantity <= 0) {
        continue;
      }

      const product = await Product.findById(
        item.productId
      ).session(session);

      // Product එක delete කරලා නම්
      // stock restore කරන්න බැහැ.
      if (!product) {
        console.warn(
          `Product not found: ${item.productId}`
        );

        continue;
      }

      // Stock restore
      product.stock += quantity;

      await product.save({
        session,
      });
    }

    // ---------------------------------------
    // STEP 3
    // Delete invoice
    // ---------------------------------------

    await Invoice.findByIdAndDelete(
      invoiceId,
      {
        session,
      }
    );

    // ---------------------------------------
    // STEP 4
    // Commit
    // ---------------------------------------

    await session.commitTransaction();

    res.json({
      success: true,
      message:
        "Invoice deleted and stock restored successfully.",
    });

  } catch (error) {

    // ---------------------------------------
    // Rollback
    // ---------------------------------------

    await session.abortTransaction();

    console.error(
      "Invoice delete transaction error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete invoice.",
    });

  } finally {

    await session.endSession();
  }
});


module.exports = router;