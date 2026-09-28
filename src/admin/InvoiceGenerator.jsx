import { useEffect, useState } from "react";


function InvoiceGenerator() {

 

const [invoice, setInvoice] = useState({
  invoiceNumber: "",
  date: new Date().toISOString().split("T")[0],

  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",

  paymentStatus: "Paid",
  notes: "",
});

useEffect(() => {
  const getInvoiceNumber = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        console.error("Admin token not found");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/invoices/next-number",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Invoice Number API:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate invoice number"
        );
      }

      setInvoice((prev) => ({
        ...prev,
        invoiceNumber: data.invoiceNumber,
      }));
    } catch (error) {
      console.error("Invoice number error:", error);
    }
  };

  getInvoiceNumber();
}, []);

  const [items, setItems] = useState([
    {
      product: "",
      productId: "",
      quantity: 1,
      unitPrice: "",
      warranty: "",
      discount: 0,
    },
  ]);



  // Products from MongoDB
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [activeProductIndex, setActiveProductIndex] = useState(null);


  //invoice number generate



  
  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductLoading(true);
        setProductError("");

        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Product API Error:", error);
        setProductError("Could not load products.");
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;

    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle product search
  const handleProductSearch = (index, value) => {
    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              product: value,
              productId: "",
            }
          : item
      )
    );
  };

  // Select product from suggestions
  const selectProduct = (index, product) => {
    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              product: product.name,
              productId: product._id,
              unitPrice: product.price || "",
              warranty: product.warranty || "",
            }
          : item
      )
    );

    setActiveProductIndex(null);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        productId: "",
        quantity: 1,
        unitPrice: "",
        warranty: "",
        discount: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) => sum + Number(item.discount || 0),
    0
  );

  const total = Math.max(0, subtotal - totalDiscount);

  const calculateItemTotal = (item) => {
    const subtotal =
      Number(item.quantity || 0) * Number(item.unitPrice || 0);

    const discount = Number(item.discount || 0);

    return Math.max(0, subtotal - discount);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };


  const handleSaveInvoice = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin authentication required. Please login again.");
      return;
    }

    // Validate invoice number
    if (!invoice.invoiceNumber) {
      alert("Invoice number is not ready yet.");
      return;
    }

    // Validate customer name
    if (!invoice.customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    // Validate products
    const validItems = items.filter(
      (item) => item.product && item.quantity > 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    // Prepare invoice items
    const invoiceItems = validItems.map((item) => ({
      product: item.product,
      productId: item.productId || null,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice || 0),
      warranty: item.warranty || "",
      discount: Number(item.discount || 0),
      total: calculateItemTotal(item),
    }));

    // Prepare invoice data
    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,

      customerName: invoice.customerName,
      customerPhone: invoice.customerPhone,
      customerEmail: invoice.customerEmail,
      customerAddress: invoice.customerAddress,

      items: invoiceItems,

      subtotal,
      totalDiscount,
      total,

      paymentStatus: invoice.paymentStatus,
      notes: invoice.notes,
    };

    const response = await fetch(
      "http://localhost:5000/api/invoices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      }
    );

    const data = await response.json();

    console.log("Save Invoice API:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save invoice."
      );
    }

    alert("Invoice saved successfully!");

    console.log("Saved Invoice:", data.invoice);
  } catch (error) {
    console.error("Save Invoice Error:", error);
    alert(error.message || "Failed to save invoice.");
  }
};


  const handlePrint = () => {
    window.print();
  };

const createNewInvoice = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin authentication required. Please login again.");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/invoices/next-number",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("New Invoice Number:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to generate invoice number"
      );
    }

    setInvoice({
      invoiceNumber: data.invoiceNumber,
      date: new Date().toISOString().split("T")[0],

      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAddress: "",

      paymentStatus: "Paid",
      notes: "",
    });

    setItems([
      {
        product: "",
        productId: "",
        quantity: 1,
        unitPrice: "",
        warranty: "",
        discount: 0,
      },
    ]);
  } catch (error) {
    console.error("New Invoice Error:", error);
    alert("Could not generate new invoice number.");
  }
};

useEffect(() => {
  const style = document.createElement("style");

  style.innerHTML = `
    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm;
      }

      html,
      body {
        width: 210mm;
        height: 297mm;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        overflow: hidden !important;
      }

      body * {
        visibility: hidden;
      }

      #invoice,
      #invoice * {
        visibility: visible;
      }

      #invoice {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 194mm !important;
        min-height: 0 !important;
        height: auto !important;
        margin: 0 !important;
        padding: 4mm !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        overflow: hidden !important;
      }

      #invoice > * {
        page-break-inside: avoid;
      }

      button,
      input,
      textarea,
      select {
        box-shadow: none !important;
      }

      .print\\\\:hidden {
        display: none !important;
      }

      .print\\\\:block {
        display: block !important;
      }
    }
  `;

  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}, []);

  return (
   <div className="max-w-6xl mx-auto px-6 py-10 print:py-0 print:px-0">
      {/* Page Header */}
      <div className="mb-10 print:hidden">
        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          PCHUB ADMIN
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
          Invoice Generator
        </h1>

        

        <p className="text-slate-500 mt-2">
          Create a professional invoice for your customer.
        </p>
      </div>

      <div className="flex justify-end mb-5 print:hidden">
  <button
    type="button"
    onClick={createNewInvoice}
    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-orange-700 transition"
  >
    New Invoice
  </button>
</div>

      {/* Product Loading Error */}
      {productError && (
        <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-5 py-4 rounded-lg print:hidden">
          {productError}
        </div>
      )}

      {/* Main Invoice Card Container */}
     <div
  id="invoice"
  className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 print:p-2 print:border-0 print:rounded-none"
>
        {/* ================= INVOICE HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">
              PCHUB
            </h2>
            <p className="text-slate-600 font-medium text-sm mt-1">
              Computer & Technology Solutions
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Sri Lanka</p>
          </div>

          <div className="md:text-right flex flex-col items-start md:items-end">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">
              INVOICE
            </h3>
            <div className="mt-2 text-sm text-slate-600 space-y-1">
              <p>
                <span className="font-semibold text-slate-500">Invoice No:</span>{" "}
                <span className="font-semibold text-slate-900 ml-2">
    {invoice.invoiceNumber || "Generating..."}
  </span>
              </p>
              <p>
                <span className="font-semibold text-slate-500">Date:</span>{" "}
                <span className="font-bold text-slate-900">{invoice.date}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ================= CUSTOMER INFO (FORM VIEW) ================= */}
        <div className="mt-8 print:hidden">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Customer Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={invoice.customerName}
                onChange={handleInvoiceChange}
                placeholder="Customer name"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="customerPhone"
                value={invoice.customerPhone}
                onChange={handleInvoiceChange}
                placeholder="07XXXXXXXX"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="customerEmail"
                value={invoice.customerEmail}
                onChange={handleInvoiceChange}
                placeholder="customer@email.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="customerAddress"
                value={invoice.customerAddress}
                onChange={handleInvoiceChange}
                placeholder="Customer address"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* ================= CUSTOMER INFO (PRINT VIEW) ================= */}
        <div className="hidden print:grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
              Billed To
            </h4>
            <p className="font-bold text-slate-900 text-base">
              {invoice.customerName || "Valued Customer"}
            </p>
            {invoice.customerAddress && (
              <p className="text-sm text-slate-600 mt-0.5">
                {invoice.customerAddress}
              </p>
            )}
            {invoice.customerPhone && (
              <p className="text-sm text-slate-600 mt-0.5">
                Phone: {invoice.customerPhone}
              </p>
            )}
            {invoice.customerEmail && (
              <p className="text-sm text-slate-600 mt-0.5">
                Email: {invoice.customerEmail}
              </p>
            )}
          </div>

          <div className="text-right">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
              Payment Status
            </h4>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
              {invoice.paymentStatus}
            </span>
          </div>
        </div>

        {/* ================= PRODUCTS TABLE SECTION ================= */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-5 print:hidden">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Products / Items
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Select products from the PCHUB product database.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              + Add Item
            </button>
          </div>

          {/* Form Input Table (Visible on Screen) */}
          <div className="overflow-x-visible print:hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-700">
                  <th className="p-3 text-sm font-semibold">Product Name</th>
                  <th className="p-3 text-sm font-semibold w-24">Qty</th>
                  <th className="p-3 text-sm font-semibold w-36">Unit Price</th>
                  <th className="p-3 text-sm font-semibold w-28">Discount</th>
                  <th className="p-3 text-sm font-semibold w-32">Warranty</th>
                  <th className="p-3 text-sm font-semibold w-36 text-right">Total</th>
                  <th className="p-3 w-16"></th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => {
                  const searchText = item.product.trim().toLowerCase();

                  const suggestions =
                    searchText.length > 0
                      ? products
                          .filter((product) =>
                            product.name
                              ?.toLowerCase()
                              .includes(searchText)
                          )
                          .slice(0, 6)
                      : [];

                  return (
                    <tr
                      key={index}
                      className="border-b border-slate-200"
                    >
                      {/* Product Search Input */}
                      <td className="p-3 align-top">
                        <div className="relative">
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) =>
                              handleProductSearch(index, e.target.value)
                            }
                            onFocus={() => setActiveProductIndex(index)}
                            placeholder="Search product..."
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                          />

                          {/* Suggestions Popup */}
                          {activeProductIndex === index &&
                            suggestions.length > 0 && (
                              <div className="absolute z-[100] left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                {suggestions.map((product) => (
                                  <button
                                    type="button"
                                    key={product._id}
                                    onClick={() =>
                                      selectProduct(index, product)
                                    }
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-b-0"
                                  >
                                    <div className="font-semibold text-slate-900">
                                      {product.name}
                                    </div>

                                    <div className="text-sm text-slate-500 mt-1">
                                      {product.category} • LKR{" "}
                                      {formatCurrency(product.price || 0)}
                                      {product.stock !== undefined && (
                                        <> • Stock: {product.stock}</>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}

                          {/* No results */}
                          {searchText.length > 0 &&
                            !productLoading &&
                            suggestions.length === 0 && (
                              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-slate-500 text-sm">
                                No matching products found.
                              </div>
                            )}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="p-3 align-top">
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-20 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                        />
                      </td>

                      {/* Unit Price */}
                      <td className="p-3 align-top">
                        <input
                          type="number"
                          name="unitPrice"
                          value={item.unitPrice}
                          min="0"
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-32 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                        />
                      </td>

                      {/* Discount */}
                      <td className="p-3 align-top">
                        <input
                          type="number"
                          name="discount"
                          value={item.discount}
                          min="0"
                          onChange={(e) => handleItemChange(index, e)}
                          placeholder="0"
                          className="w-24 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                        />
                      </td>

                      {/* Warranty */}
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            name="warranty"
                            value={item.warranty}
                            min="0"
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="12"
                            className="w-16 border border-slate-300 rounded-lg px-2 py-2 outline-none focus:border-blue-500 text-center"
                          />
                          <span className="text-xs text-slate-500">
                            Mos
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="p-3 align-top font-semibold text-right whitespace-nowrap text-slate-900 pt-4">
                        LKR {formatCurrency(calculateItemTotal(item))}
                      </td>

                      {/* Remove Button */}
                      <td className="p-3 align-top text-right pt-4">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Clean Printed Invoice Table (Print Only) */}
          <div className="hidden print:block my-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-900 text-xs uppercase tracking-wider">
                  <th className="py-2 text-left">Product Name</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Discount</th>
                  <th className="py-2 text-center">Warranty</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 pr-2 font-medium">{item.product || "-"}</td>
                    <td className="py-3 px-2 text-center">{item.quantity}</td>
                    <td className="py-3 px-2 text-right">
                      LKR {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="py-3 px-2 text-right text-red-600">
                      {item.discount > 0
                        ? `- LKR ${formatCurrency(item.discount)}`
                        : "0.00"}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {item.warranty ? `${item.warranty} Months` : "N/A"}
                    </td>
                    <td className="py-3 pl-2 text-right font-bold text-slate-900">
                      LKR {formatCurrency(calculateItemTotal(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= TOTALS SUMMARY ================= */}
        <div className="flex justify-end mt-6 border-t border-slate-200 pt-4">
          <div className="w-full md:w-80 space-y-2">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>Sub Total</span>
              <span className="font-semibold text-slate-900">
                LKR {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-red-600 text-sm">
              <span>Discount</span>
              <span className="font-semibold">
                - LKR {formatCurrency(totalDiscount)}
              </span>
            </div>

            <div className="border-t border-slate-300 pt-3 mt-2 flex justify-between text-lg font-black text-slate-900">
              <span>Total Amount</span>
              <span className="text-blue-600">
                LKR {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* ================= PAYMENT STATUS (FORM INPUT) ================= */}
        <div className="mt-8 print:hidden">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Payment Status
          </label>

          <select
            name="paymentStatus"
            value={invoice.paymentStatus}
            onChange={handleInvoiceChange}
            className="w-full md:w-72 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>

        {/* ================= NOTES ================= */}
        <div className="mt-8 print:hidden">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Notes
          </label>

          <textarea
            name="notes"
            value={invoice.notes}
            onChange={handleInvoiceChange}
            rows="3"
            placeholder="Additional notes..."
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none transition"
          />
        </div>

        {/* Notes (Print View) */}
        {invoice.notes && (
          <div className="hidden print:block mt-6 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Terms & Notes
            </h4>
            <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="border-t border-slate-200 mt-10 pt-6 text-center">
          <p className="font-bold text-slate-900 text-sm">
            Thank you for choosing PCHUB.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Computer & Technology Solutions
          </p>
        </div>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="mt-8 flex flex-wrap gap-4 print:hidden">
       <button
  type="button"
  onClick={() => {
    handlePrint();
    handleSaveInvoice();
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
>
  🖨️ Print / Save PDF
</button>





        <button
          type="button"
          onClick={() => window.history.back()}
          className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 px-7 py-3 rounded-lg font-semibold transition"
        >
          Back
        </button>
      </div>
    </div>
  );

}

export default InvoiceGenerator;