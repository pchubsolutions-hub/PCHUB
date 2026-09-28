import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save username for OTP page
      sessionStorage.setItem(
        "adminUsername",
        username
      );

      navigate("/admin/verify-otp");

    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.message || "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-8">

          <p className="text-blue-500 font-bold tracking-widest text-sm">
            PCHUB
          </p>

          <h1 className="text-3xl font-bold text-white mt-2">
            Admin Login
          </h1>

          <p className="text-slate-400 mt-2">
            Sign in to access the admin panel
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Username */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter admin username"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter admin password"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading
                ? "Sending OTP..."
                : "Continue"}
            </button>

          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Admin access only
          </p>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;