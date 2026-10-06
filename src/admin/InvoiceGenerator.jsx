import { useEffect, useState } from "react";

import samsungLogo from "../assets/samsung.png";
import msiLogo from "../assets/msi.png";
import acerLogo from "../assets/acer.png";
import asusLogo from "../assets/asus.png";
import nvidiaLogo from "../assets/nvidia.png";
;


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
        `${import.meta.env.VITE_API_URL}/api/invoices/next-number`,
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

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);

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
      `${import.meta.env.VITE_API_URL}/api/invoices`,
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
      `${import.meta.env.VITE_API_URL}/api/invoices/next-number`,
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
  className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 print:p-2 print:border-0 print:rounded-none shadow-sm text-black"
>
  {/* ================= EXACT HEADER SECTION ================= */}
  <div className="border-t-4 border-black pt-4 pb-6">
    {/* Top Bar with Logo and Center Aligned Address */}
    <div className="relative flex flex-col items-center justify-center min-h-[80px]">
      {/* Left Logo / Icon Place */}
      <div className="absolute left-0 top-0 flex items-center gap-2">
        <div className="font-extrabold text-xl tracking-tighter flex items-center gap-1.5 text-black">
          <span className="border-2 border-black p-1 rounded-sm text-xs">💻</span>
          <span>PC HUB</span>
        </div>
      </div>

      {/* Main Header Center Details */}
      <div className="text-center mt-6 md:mt-0">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-black uppercase font-serif">
          PC HUB
        </h1>
        <p className="text-sm font-bold text-black mt-1">
          No:148, Uggalbada, Kalutara, Sri Lanka
        </p>
        <p className="text-xs font-semibold text-black mt-0.5">
          Tel : 075 1663654 &nbsp;|&nbsp; Email : pchubsoution@gmail.com
        </p>
      </div>
    </div>

    {/* INVOICE Title */}
    <div className="text-center my-6">
      <h2 className="text-2xl md:text-3xl font-black tracking-widest text-black uppercase">
        INVOICE
      </h2>
    </div>

    {/* Invoice Details & Customer Info Header Row */}
    <div className="grid grid-cols-2 justify-between items-start pt-2 text-sm font-bold text-black">
      {/* Left Column: Customer Info */}
      <div className="space-y-1">
        <p>
          INVOICE TO :{""}
          <span className="font-normal    px-2 min-w-[200px]">
            {invoice.customerName || ""}
          </span>
        </p>
        {invoice.customerAddress && (
          <p className="text-xs font-normal text-slate-700 pl-24">
            {invoice.customerAddress}
          </p>
        )}
        {invoice.customerPhone && (
          <p className="text-xs font-normal text-slate-700 pl-24">
            {invoice.customerPhone}
          </p>
        )}

        {invoice.customerEmail && (
          <p className="text-xs font-normal text-slate-700 pl-24">
            {invoice.customerEmail}
          </p>
        )}
      </div>

      {/* Right Column: Date & Invoice No */}
      <div className="text-right space-y-2">
        <p>
          Date :{" "}
          <span className="font-normal  px-2 inline-block min-w-[150px]">
            {invoice.date || ""}
          </span>
        </p>
        <p>
          Invoice No :{" "}
          <span className="font-normal  px-2 inline-block min-w-[150px]">
            {invoice.invoiceNumber || ""}
          </span>
        </p>
      </div>
    </div>
  </div>

  {/* ================= CUSTOMER INFO (FORM VIEW - WEB ONLY) ================= */}
  <div className="mt-6 print:hidden bg-slate-50 p-4 rounded-xl border border-slate-200">
    <h3 className="text-md font-bold text-slate-800 mb-3">
      Edit Customer Details
    </h3>
    <div className="grid md:grid-cols-2 gap-4">
      <input
        type="text"
        name="customerName"
        value={invoice.customerName || ""}
        onChange={handleInvoiceChange}
        placeholder="Customer Name"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <input
        type="text"
        name="customerPhone"
        value={invoice.customerPhone || ""}
        onChange={handleInvoiceChange}
        placeholder="Phone Number"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <input
        type="email"
        name="customerEmail"
        value={invoice.customerEmail || ""}
        onChange={handleInvoiceChange}
        placeholder="Email Address"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <input
        type="text"
        name="customerAddress"
        value={invoice.customerAddress || ""}
        onChange={handleInvoiceChange}
        placeholder="Address"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  </div>

  {/* ================= PRODUCTS TABLE SECTION ================= */}
  <div className="mt-6 h-100">
    <div className="flex justify-between items-center mb-4 print:hidden">
      <h3 className="text-lg font-bold text-slate-900">Invoice Items</h3>
      <button
        type="button"
        onClick={addItem}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
      >
        + Add Item
      </button>
    </div>

    {/* Form Input Table (Visible on Screen) */}
    <div className="overflow-x-auto print:hidden h-100">
      <table className="w-full border-collapse min-w-[700px]">
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
            const searchText = (item.product || "").trim().toLowerCase();
            const suggestions =
              searchText.length > 0
                ? products
                    .filter((product) =>
                      product.name?.toLowerCase().includes(searchText)
                    )
                    .slice(0, 6)
                : [];

            return (
              <tr key={index} className="border-b border-slate-200">
                <td className="p-3 align-top">
                  <div className="relative">
                    <input
                      type="text"
                      value={item.product || ""}
                      onChange={(e) =>
                        handleProductSearch(index, e.target.value)
                      }
                      onFocus={() => setActiveProductIndex(index)}
                      placeholder="Search product..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />

                    {activeProductIndex === index &&
                      suggestions.length > 0 && (
                        <div className="absolute z-[100] left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {suggestions.map((product) => (
                            <button
                              type="button"
                              key={product._id}
                              onClick={() => selectProduct(index, product)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-slate-100 text-sm"
                            >
                              <div className="font-semibold text-slate-900">
                                {product.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                LKR {formatCurrency(product.price || 0)}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </td>
                <td className="p-3 align-top">
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </td>
                <td className="p-3 align-top">
                  <input
                    type="number"
                    name="unitPrice"
                    value={item.unitPrice}
                    min="0"
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </td>
                <td className="p-3 align-top">
                  <input
                    type="number"
                    name="discount"
                    value={item.discount}
                    min="0"
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </td>
                <td className="p-3 align-top">
                  <input
                    type="number"
                    name="warranty"
                    value={item.warranty || ""}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="12"
                    className="w-16 border border-slate-300 rounded-lg px-2 py-2 text-sm outline-none text-center"
                  />
                </td>
                <td className="p-3 align-top font-semibold text-right text-slate-900 pt-4 text-sm">
                  LKR {formatCurrency(calculateItemTotal(item))}
                </td>
                <td className="p-3 align-top text-right pt-4">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
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

    {/* Printed Invoice Table (Clean Print View) */}
    <div className="hidden print:block my-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-y-2 border-black text-black text-xs uppercase font-bold">
            <th className="py-2 text-left">Item Description</th>
            <th className="py-2 text-center">Qty</th>
            <th className="py-2 text-right">Unit Price</th>
            <th className="py-2 text-right">Discount</th>
            <th className="py-2 text-center">Warranty</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm text-black">
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-2.5 pr-2 font-medium">{item.product || "-"}</td>
              <td className="py-2.5 px-2 text-center">{item.quantity}</td>
              <td className="py-2.5 px-2 text-right">
                {formatCurrency(item.unitPrice || 0)}
              </td>
              <td className="py-2.5 px-2 text-right">
                {item.discount > 0 ? formatCurrency(item.discount) : "-"}
              </td>
              <td className="py-2.5 px-2 text-center">
                {item.warranty ? `${item.warranty} Mos` : "-"}
              </td>
              <td className="py-2.5 pl-2 text-right font-bold">
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
    <div className="w-full md:w-72 space-y-2 text-sm text-black">
      <div className="flex justify-between">
        <span>Sub Total</span>
        <span className="font-semibold">LKR {formatCurrency(subtotal)}</span>
      </div>
      {totalDiscount > 0 && (
        <div className="flex justify-between text-red-600">
          <span>Discount</span>
          <span className="font-semibold">
            - LKR {formatCurrency(totalDiscount)}
          </span>
        </div>
      )}
      <div className="border-t-2 border-black pt-2 mt-2 flex justify-between font-black text-base">
        <span>TOTAL</span>
        <span>LKR {formatCurrency(total)}</span>
      </div>
    </div>
  </div>

  {/* ================= EXACT FOOTER WITH BRAND LOGOS ================= */}
  <div className="mt-12 pt-6 border-t border-slate-200">
    <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto px-4 opacity-90 grayscale hover:grayscale-0 transition-all">
      <img
        src={samsungLogo}
        alt="Samsung"
        className="h-6 md:h-8 object-contain"
      />
      <img
        src={msiLogo}
        alt="MSI"
        className="h-6 md:h-8 object-contain"
      />
      <img
        src={acerLogo}
        alt="Acer"
        className="h-6 md:h-8 object-contain"
      />
      <img
        src={asusLogo}
        alt="Asus"
        className="h-6 md:h-8 object-contain"
      />
      <img
        src={nvidiaLogo}
        alt="Nvidia"
        className="h-6 md:h-8 object-contain"
      />
    </div>
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