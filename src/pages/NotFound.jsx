import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";

function NotFound() {
  return (
    
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-6">
        <PageTitle title="Computer Store" />
      <div className="max-w-2xl mx-auto text-center">

        {/* 404 */}
        <div className="relative">

          <h1 className="text-[120px] md:text-[180px] leading-none font-black text-slate-200">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl">
              🔍
            </span>
          </div>

        </div>

        {/* Content */}
        <p className="text-blue-600 font-semibold uppercase tracking-wider mt-4">
          Page Not Found
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
          Oops! This Page Doesn't Exist
        </h2>

        <p className="text-slate-500 leading-7 max-w-lg mx-auto mt-4">
          The page you are looking for may have been moved, deleted,
          or the URL you entered may be incorrect.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">

          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-lg font-semibold transition"
          >
            ← Back to Home
          </Link>

          <Link
            to="/products"
            className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 bg-white text-slate-700 px-7 py-3.5 rounded-lg font-semibold transition"
          >
            Browse Products
          </Link>

        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm">

          <Link
            to="/about"
            className="text-slate-500 hover:text-blue-600 transition"
          >
            About
          </Link>

          <Link
            to="/products"
            className="text-slate-500 hover:text-blue-600 transition"
          >
            Products
          </Link>

          <Link
            to="/services"
            className="text-slate-500 hover:text-blue-600 transition"
          >
            Services
          </Link>

          <Link
            to="/contact"
            className="text-slate-500 hover:text-blue-600 transition"
          >
            Contact
          </Link>

        </div>

      </div>
    </div>
  );
}

export default NotFound;

