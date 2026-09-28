import { Outlet, Link, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem("adminToken");

    // Remove temporary login data
    sessionStorage.removeItem("adminUsername");

    // Go to login page
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Admin Header */}
      <header className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/admin"
              className="text-xl font-bold"
            >
              PCHUB
              <span className="text-blue-500 ml-1">
                ADMIN
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">

              <Link
                to="/admin"
                className="text-slate-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/products"
                className="text-slate-300 hover:text-white transition"
              >
                Products
              </Link>

              <Link
                to="/admin/inquiries"
                className="text-slate-300 hover:text-white transition"
              >
                Inquiries
              </Link>

          {/* invoice generate */}

          <button
  type="button"
  onClick={() => navigate("/admin/invoices/create")}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
>
  <div className="text-left">
    <p className="text-white font-semibold text-slate-900">
      Generate Invoice
    </p>

    
  </div>

  
</button>

{/*Invoice hostory */}

<Link
  to="/admin/invoices"
  className="bg-orange-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
>
  Invoice History
</Link>
              

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>

            </nav>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="md:hidden bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* Admin Content */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;