import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    date: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    paymentStatus: "Paid",
    notes: "",
  });

  const [items, setItems] = useState([]);

  // Load invoice
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("adminToken");




        if (!token) {
          throw new Error("Admin authentication required.");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/invoices/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load invoice."
          );
        }

        const loadedInvoice = data.invoice;

        setInvoice({
          invoiceNumber: loadedInvoice.invoiceNumber || "",
          date: loadedInvoice.date
            ? new Date(loadedInvoice.date)
                .toISOString()
                .split("T")[0]
            : "",
          customerName: loadedInvoice.customerName || "",
          customerPhone: loadedInvoice.customerPhone || "",
          customerEmail: loadedInvoice.customerEmail || "",
          customerAddress:
            loadedInvoice.customerAddress || "",
          paymentStatus:
            loadedInvoice.paymentStatus || "Paid",
          notes: loadedInvoice.notes || "",
        });

        setItems(
          loadedInvoice.items?.length
            ? loadedInvoice.items
            : [
                {
                  product: "",
                  productId: "",
                  quantity: 1,
                  unitPrice: 0,
                  warranty: "",
                  discount: 0,
                  total: 0,
                },
              ]
        );
      } catch (error) {
        console.error("Load Invoice Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  // Invoice changes
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;

    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Item changes
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

  // Add item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        productId: "",
        quantity: 1,
        unitPrice: 0,
        warranty: "",
        discount: 0,
        total: 0,
      },
    ]);
  };

  // Remove item
  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // Calculate item total
  const calculateItemTotal = (item) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);
    const discount = Number(item.discount || 0);

    return Math.max(
      0,
      quantity * unitPrice - discount
    );
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.unitPrice || 0),
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) =>
      sum + Number(item.discount || 0),
    0
  );

  const total = Math.max(
    0,
    subtotal - totalDiscount
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Save changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin authentication required.");
        return;
      }

      if (!invoice.customerName.trim()) {
        alert("Please enter customer name.");
        return;
      }

      if (items.length === 0) {
        alert("Please add at least one product.");
        return;
      }

      const validItems = items.filter(
        (item) =>
          item.product &&
          Number(item.quantity) > 0
      );

      if (validItems.length === 0) {
        alert("Please add a valid product.");
        return;
      }

      const invoiceItems = validItems.map((item) => ({
        product: item.product,
        productId: item.productId || null,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice || 0),
        warranty: item.warranty || "",
        discount: Number(item.discount || 0),
        total: calculateItemTotal(item),
      }));

      const invoiceData = {
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

      setSaving(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(invoiceData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update invoice."
        );
      }

      alert("Invoice updated successfully.");

      navigate("/admin/invoices");
    } catch (error) {
      console.error("Update Invoice Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">
          Loading invoice...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/invoices")
            }
            className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-lg"
          >
            Back to Invoice History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Edit Invoice
          </h1>

          <p className="text-slate-500 mt-1">
            Edit invoice details and save changes.
          </p>
        </div>

        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-slate-500">
            Invoice
          </span>

          <p className="font-bold text-blue-600">
            {invoice.invoiceNumber}
          </p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

        <h2 className="text-lg font-bold text-slate-900 mb-5">
          Customer Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer Name *
            </label>

            <input
              type="text"
              name="customerName"
              value={invoice.customerName}
              onChange={handleInvoiceChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone
            </label>

            <input
              type="text"
              name="customerPhone"
              value={invoice.customerPhone}
              onChange={handleInvoiceChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="customerEmail"
              value={invoice.customerEmail}
              onChange={handleInvoiceChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Invoice Date
            </label>

            <input
              type="date"
              name="date"
              value={invoice.date}
              onChange={handleInvoiceChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>

            <textarea
              name="customerAddress"
              value={invoice.customerAddress}
              onChange={handleInvoiceChange}
              rows="3"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>

      {/* Products */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Products
            </h2>

            <p className="text-sm text-slate-500">
              Update products, quantities and prices.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>

        </div>

        <div className="space-y-5">

          {items.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl p-5"
            >

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900">
                  Product {index + 1}
                </h3>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(index)
                    }
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product
                  </label>

                  <input
                    type="text"
                    name="product"
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(index, e)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, e)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit Price
                  </label>

                  <input
                    type="number"
                    name="unitPrice"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, e)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Warranty
                  </label>

                  <input
                    type="text"
                    name="warranty"
                    value={item.warranty}
                    onChange={(e) =>
                      handleItemChange(index, e)
                    }
                    placeholder="Example: 12 Months"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Discount
                  </label>

                  <input
                    type="number"
                    name="discount"
                    min="0"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(index, e)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div className="mt-4 flex justify-end">
                <div className="bg-slate-50 rounded-lg px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Item Total:{" "}
                  </span>

                  <span className="font-bold text-slate-900">
                    Rs.{" "}
                    {formatCurrency(
                      calculateItemTotal(item)
                    )}
                  </span>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Payment & Notes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

        <h2 className="text-lg font-bold text-slate-900 mb-5">
          Payment & Notes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Status
            </label>

            <select
              name="paymentStatus"
              value={invoice.paymentStatus}
              onChange={handleInvoiceChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              value={invoice.notes}
              onChange={handleInvoiceChange}
              rows="3"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

        <div className="max-w-sm ml-auto space-y-3">

          <div className="flex justify-between">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium">
              Rs. {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Discount
            </span>

            <span className="font-medium text-red-600">
              - Rs. {formatCurrency(totalDiscount)}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between">
            <span className="text-lg font-bold">
              Total
            </span>

            <span className="text-lg font-bold text-blue-600">
              Rs. {formatCurrency(total)}
            </span>
          </div>

        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/invoices")
          }
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

    </div>
  );
}

export default EditInvoice;