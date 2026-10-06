import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

console.log("InvoiceHistory component loaded");

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  

  const [selectedInvoice, setSelectedInvoice] = useState(null);
const [showViewModal, setShowViewModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [invoiceToDelete, setInvoiceToDelete] = useState(null);
const navigate = useNavigate();

const handleView = (invoice) => {
  setSelectedInvoice(invoice);
  setShowViewModal(true);
};

const handlePrint = () => {
  window.print();
};




const handleDeleteClick = (invoice) => {
  setInvoiceToDelete(invoice);
  setShowDeleteModal(true);
};


   const handleEdit = (invoice) => {
  navigate(`/admin/invoices/edit/${invoice._id}`);
};

const handleDeleteConfirm = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin authentication required.");
      return;
    }

 

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/invoices/${invoiceToDelete._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete invoice."
      );
    }

    setInvoices((prev) =>
      prev.filter(
        (invoice) => invoice._id !== invoiceToDelete._id
      )
    );

    setShowDeleteModal(false);
    setInvoiceToDelete(null);

    alert("Invoice deleted successfully.");
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    alert(error.message);
  }
};

  const fetchInvoices = async () => {
  try {
    console.log("1. Fetch invoices started");

    setLoading(true);
    setError("");

    const token = localStorage.getItem("adminToken");

    console.log("2. Admin token:", token ? "Token exists" : "NO TOKEN");

    if (!token) {
      throw new Error("Admin authentication required.");
    }




    console.log("3. Sending request...");



    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/invoices`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("4. Response status:", response.status);

    const data = await response.json();

    console.log("5. API response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch invoices."
      );
    }

    setInvoices(data.invoices || []);

    console.log(
      "6. Invoices loaded:",
      data.invoices?.length
    );
  } catch (error) {
    console.error("Invoice History Error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
    console.log("7. Fetch completed");
  }
};

  

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = search.toLowerCase();

    return (
      invoice.invoiceNumber
        ?.toLowerCase()
        .includes(searchText) ||
      invoice.customerName
        ?.toLowerCase()
        .includes(searchText) ||
      invoice.customerPhone
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
  };

  

return (
  <>
    <style>{`
      @media print {
        body * {
          visibility: hidden !important;
        }

        .print-backdrop,
        .print-backdrop * {
          visibility: visible !important;
        }

        .print-backdrop {
          position: absolute !important;
          inset: 0 !important;
          background: white !important;
          padding: 0 !important;
          display: block !important;
        }

        .print-invoice {
          position: relative !important;
          width: 100% !important;
          max-width: 100% !important;
          max-height: none !important;
          overflow: visible !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }

        .no-print {
          display: none !important;
        }

        @page {
          size: A4;
          margin: 3mm;
        }
      }
    `}</style>

    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Invoice History
          </h1>

          <p className="text-slate-500 mt-1">
            View and manage all generated invoices.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Total Invoices:{" "}
          <span className="font-semibold text-slate-900">
            {invoices.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <input
          type="text"
          placeholder="Search by invoice number, customer name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500">
            Loading invoices...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchInvoices}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredInvoices.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-slate-500">
              No invoices found.
            </p>
          </div>
        )}

      {/* Invoice Table */}
      {!loading &&
        !error &&
        filteredInvoices.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Invoice
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      Total
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      Items
                    </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="hover:bg-slate-50 transition"
                    >
                      {/* Invoice Number */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-blue-600">
                          {invoice.invoiceNumber}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {invoice.customerName}
                        </p>

                        {invoice.customerEmail && (
                          <p className="text-xs text-slate-500 mt-1">
                            {invoice.customerEmail}
                          </p>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {invoice.customerPhone || "-"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(invoice.date)}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-900">
                          Rs. {formatCurrency(invoice.total)}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : invoice.paymentStatus === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {invoice.paymentStatus}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-600">
                          {invoice.items?.length || 0}
                        </span>
                      </td>

<td className="px-6 py-4">
  <div className="flex items-center justify-center gap-2">
    
    <button
      type="button"
      onClick={() => handleView(invoice)}
      className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
    >
      View
    </button>

  <button
  type="button"
  onClick={() => handleEdit(invoice)}
  className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
>
  Edit
</button>

    <button
      type="button"
      onClick={() => handleDeleteClick(invoice)}
      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
    >
      Delete
    </button>

  </div>
</td>


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

{showDeleteModal && invoiceToDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
      
      <h2 className="text-xl font-bold text-slate-900">
        Delete Invoice?
      </h2>

      <p className="text-slate-600 mt-3">
        Are you sure you want to delete invoice{" "}
        <span className="font-semibold text-slate-900">
          {invoiceToDelete.invoiceNumber}
        </span>
        ?
      </p>

      <p className="text-sm text-red-500 mt-2">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => {
            setShowDeleteModal(false);
            setInvoiceToDelete(null);
          }}
          className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
        >
          No, Cancel
        </button>

        <button
          type="button"
          onClick={handleDeleteConfirm}
          className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>

    </div>
  </div>
)}

{showViewModal && selectedInvoice && (
  <div className="print-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
<div className="print-invoice bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
      
  
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">

      {/* Print Only Invoice Header */}
<div className="print-only-header">
  <div className="text-center pb-4 mb-4">

  

    <h1 className="text-2xl font-bold text-slate-900">
      PCHUB
    </h1>

    <p className="text-sm text-slate-600">
      Computer Sales & Services
    </p>

    <p className="text-sm text-slate-600 mt-1">
      Kalutara, Sri Lanka
    </p>

    <p className="text-sm text-slate-600">
      Tel: +94 XX XXX XXXX
    </p>

  </div>
</div>

        <div>

          
          <h2 className="text-xl font-bold text-slate-900">
            Invoice Details
          </h2>

          <p className="text-blue-600 font-semibold mt-1">
            {selectedInvoice.invoiceNumber}
          </p>
        </div>


      </div>



      <div className="p-6 space-y-6">



        {/* Customer & Invoice Information Wrapper */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">

  {/* Left Side: Customer Details */}
  <div>
    <h3 className="font-semibold text-slate-900 mb-3">
      Customer Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 h-[calc(100%-2rem)]">
      <div>
        <p className="text-xs text-slate-500">
          Name
        </p>
        <p className="font-medium">
          {selectedInvoice.customerName}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Phone
        </p>
        <p className="font-medium">
          {selectedInvoice.customerPhone || "-"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Email
        </p>
        <p className="font-medium">
          {selectedInvoice.customerEmail || "-"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Address
        </p>
        <p className="font-medium">
          {selectedInvoice.customerAddress || "-"}
        </p>
      </div>
    </div>
  </div>

  {/* Right Side: Invoice Information */}
  <div>
    <h3 className="font-semibold text-slate-900 mb-3">
      Invoice Information
    </h3>

    <div className="grid grid-cols-1 gap-3 bg-slate-50 rounded-xl p-4">
      <div>
        <p className="text-xs text-slate-500">
          Invoice Number
        </p>
        <p className="font-semibold text-slate-900">
          {selectedInvoice.invoiceNumber}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Date
        </p>
        <p className="font-semibold text-slate-900">
          {formatDate(selectedInvoice.date)}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Payment Status
        </p>
        <p className="font-semibold text-slate-900">
          {selectedInvoice.paymentStatus}
        </p>
      </div>
    </div>
  </div>

</div>

        {/* Products */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">
            Products
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">
                    Product
                  </th>

                  <th className="px-4 py-3 text-center text-sm">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right text-sm">
                    Unit Price
                  </th>

                  <th className="px-4 py-3 text-center text-sm">
                    Warranty
                  </th>

                  <th className="px-4 py-3 text-right text-sm">
                    Discount
                  </th>

                  <th className="px-4 py-3 text-right text-sm">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {selectedInvoice.items?.map(
                  (item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        {item.product}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3 text-right">
                        Rs. {formatCurrency(item.unitPrice)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.warranty || "-"}
                      </td>

                      <td className="px-4 py-3 text-right">
                        Rs. {formatCurrency(item.discount)}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold">
                        Rs. {formatCurrency(item.total)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium">
                Rs. {formatCurrency(selectedInvoice.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Discount
              </span>

              <span className="font-medium text-red-600">
                - Rs.{" "}
                {formatCurrency(
                  selectedInvoice.totalDiscount
                )}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-lg">
                Total
              </span>

              <span className="font-bold text-lg text-blue-600">
                Rs. {formatCurrency(selectedInvoice.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {selectedInvoice.notes && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Notes
            </h3>

            <div className="bg-slate-50 rounded-xl p-4 text-slate-600">
              {selectedInvoice.notes}
            </div>
          </div>
        )}

      </div>

      <div className="no-print border-t p-5 flex justify-end gap-3">
  
  <button
    type="button"
    onClick={handlePrint}
    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Print Invoice
  </button>

  <button
    type="button"
    onClick={() => {
      setShowViewModal(false);
      setSelectedInvoice(null);
    }}
    className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
  >
    Close
  </button>

</div>

    </div>
  </div>
)}

    </div>
    </>
  );
}

export default InvoiceHistory;