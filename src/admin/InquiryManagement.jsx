import { useEffect, useState } from "react";

function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET ADMIN TOKEN
  // =========================

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // =========================
  // FETCH INQUIRIES
  // =========================

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication required.");
      }

      const response = await fetch(
        "http://localhost:5000/api/inquiries",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch inquiries");
      }

      const data = await response.json();

      setInquiries(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Inquiry fetch error:", err);
      setError("Could not load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // =========================
  // MARK AS READ
  // =========================

  const markAsRead = async (id) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication required.");
      }

      const response = await fetch(
        `http://localhost:5000/api/inquiries/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update inquiry");
      }

      setInquiries((currentInquiries) =>
        currentInquiries.map((inquiry) =>
          inquiry._id === id
            ? { ...inquiry, status: "Read" }
            : inquiry
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
      alert("Failed to mark inquiry as read.");
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteInquiry = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );

    if (!confirmDelete) return;

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication required.");
      }

      const response = await fetch(
        `http://localhost:5000/api/inquiries/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete inquiry");
      }

      setInquiries((currentInquiries) =>
        currentInquiries.filter(
          (inquiry) => inquiry._id !== id
        )
      );
    } catch (err) {
      console.error("Delete inquiry error:", err);
      alert("Failed to delete inquiry.");
    }
  };

  // =========================
  // STATISTICS
  // =========================

  const totalInquiries = inquiries.length;

  const newInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "New"
  ).length;

  const readInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "Read"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            PCHUB ADMIN
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Customer Inquiries
          </h1>

          <p className="text-slate-500 mt-2">
            View and manage customer inquiries.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <div className="grid sm:grid-cols-3 gap-6 mb-10">

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <p className="text-slate-500 text-sm">
              Total Inquiries
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {totalInquiries}
            </h2>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <p className="text-slate-500 text-sm">
              New Inquiries
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {newInquiries}
            </h2>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <p className="text-slate-500 text-sm">
              Read
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {readInquiries}
            </h2>

          </div>

        </div>

        {/* INQUIRIES */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-200">

            <h2 className="text-xl font-bold text-slate-900">
              All Customer Inquiries
            </h2>

          </div>

          {loading ? (

            <div className="p-10 text-center">
              <p className="text-slate-500">
                Loading inquiries...
              </p>
            </div>

          ) : inquiries.length === 0 ? (

            <div className="p-10 text-center">

              <div className="text-4xl mb-4">
                📭
              </div>

              <h3 className="font-semibold text-slate-900">
                No inquiries yet
              </h3>

              <p className="text-slate-500 mt-1">
                Customer inquiries will appear here.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-200">

              {inquiries.map((inquiry) => (

                <div
                  key={inquiry._id}
                  className="p-6 hover:bg-slate-50 transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    {/* INFO */}

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-bold text-lg text-slate-900">
                          {inquiry.subject}
                        </h3>

                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            inquiry.status === "New"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {inquiry.status}
                        </span>

                      </div>

                      <div className="mt-3 space-y-1">

                        <p className="text-sm text-slate-700">
                          <strong>Name:</strong>{" "}
                          {inquiry.name}
                        </p>

                        <p className="text-sm text-slate-700">
                          <strong>Email:</strong>{" "}
                          {inquiry.email}
                        </p>

                        {inquiry.phone && (
                          <p className="text-sm text-slate-700">
                            <strong>Phone:</strong>{" "}
                            {inquiry.phone}
                          </p>
                        )}

                      </div>

                      <div className="mt-4 bg-slate-50 rounded-lg p-4">

                        <p className="text-sm text-slate-600 whitespace-pre-wrap">
                          {inquiry.message}
                        </p>

                      </div>

                      <p className="text-xs text-slate-400 mt-3">
                        {inquiry.createdAt
                          ? new Date(
                              inquiry.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex lg:flex-col gap-3">

                      {inquiry.status === "New" && (
                        <button
                          onClick={() =>
                            markAsRead(inquiry._id)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          ✓ Mark as Read
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteInquiry(inquiry._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default InquiryManagement;