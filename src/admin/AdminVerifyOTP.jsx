import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminVerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const username = sessionStorage.getItem("adminUsername");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!username) {
        setError("Login session expired. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "OTP verification failed"
        );
      }

      // Save JWT token
      localStorage.setItem(
        "adminToken",
        data.token
      );

      // Remove temporary username
      sessionStorage.removeItem("adminUsername");

      // Go to dashboard
      navigate("/admin");

    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setError(
        error.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <p className="text-blue-500 font-bold tracking-widest text-sm">
            PCHUB
          </p>

          <h1 className="text-3xl font-bold text-white mt-2">
            Verify OTP
          </h1>

          <p className="text-slate-400 mt-3 leading-6">
            Enter the 6-digit OTP sent to your
            admin email address.
          </p>

        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleVerifyOTP}
            className="space-y-6"
          >

            {/* OTP */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="Enter 6-digit OTP"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Verify */}
            <button
              type="submit"
              disabled={
                loading || otp.length !== 6
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

          </form>

          {/* Back */}
          <button
            onClick={() => {
              sessionStorage.removeItem(
                "adminUsername"
              );

              navigate("/admin/login");
            }}
            className="w-full mt-4 text-slate-500 hover:text-blue-600 text-sm font-medium transition"
          >
            ← Back to Login
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            OTP is required for secure admin access.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AdminVerifyOTP;