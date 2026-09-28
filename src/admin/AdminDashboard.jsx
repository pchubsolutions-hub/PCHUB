
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  // =====================================
  // STATES
  // =====================================

  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [productLoading, setProductLoading] = useState(true);
  const [inquiryLoading, setInquiryLoading] = useState(true);

  const [productError, setProductError] = useState("");
  const [inquiryError, setInquiryError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // =====================================
  // FETCH PRODUCTS
  // =====================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        console.log("Products API:", data);

        // API response can be:
        // [products]
        // OR
        // { products: [...] }

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
          setProductError("Invalid product data.");
        }

      } catch (error) {
        console.error("Product API Error:", error);

        setProducts([]);
        setProductError(
          "Could not connect to product API."
        );

      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =====================================
  // FETCH INQUIRIES
  // =====================================

 // =====================================
// FETCH INQUIRIES
// =====================================

useEffect(() => {
  const fetchInquiries = async () => {
    try {
      setInquiryLoading(true);
      setInquiryError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin authentication required."
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inquiries`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch inquiries"
        );
      }

      const data = await response.json();

      console.log("Inquiry API:", data);

      if (Array.isArray(data)) {
        setInquiries(data);
      } else {
        setInquiries([]);
      }

    } catch (error) {
      console.error(
        "Inquiry API Error:",
        error
      );

      setInquiries([]);

      setInquiryError(
        "Could not load inquiries."
      );

    } finally {
      setInquiryLoading(false);
    }
  };

  fetchInquiries();
}, []);

  // =====================================
  // PRODUCT STATISTICS
  // =====================================

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) => Number(product.stock) > 0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 5
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0
  );

  // =====================================
  // CATEGORY BREAKDOWN
  // =====================================

  const categoryCounts = {};

  products.forEach((product) => {
    const category = product.category || "Other";

    categoryCounts[category] =
      (categoryCounts[category] || 0) + 1;
  });

  // =====================================
  // SEARCH
  // =====================================

  const searchResults = products.filter((product) => {
    const name =
      product.name?.toLowerCase() || "";

    const category =
      product.category?.toLowerCase() || "";

    const search =
      searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      category.includes(search)
    );
  });

  // =====================================
  // INQUIRY STATISTICS
  // =====================================

  const totalInquiries = inquiries.length;

  const newInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "New"
  ).length;

  const readInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "Read"
  ).length;

  // =====================================
  // LOADING
  // =====================================

  const loading =
    productLoading || inquiryLoading;

  // =====================================
  // RETURN
  // =====================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* =================================
            HEADER
        ================================= */}

        <div className="mb-10">

          <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            PCHUB ADMIN
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your PCHUB products and website.
          </p>

        </div>

        {/* =================================
            API ERRORS
        ================================= */}

        {productError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            {productError}
          </div>
        )}

        {inquiryError && (
          <div className="mb-4 bg-orange-50 border border-orange-200 text-orange-700 px-5 py-4 rounded-xl">
            {inquiryError}
          </div>
        )}

        {/* =================================
            STATISTICS
        ================================= */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* TOTAL */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm">
              Total Products
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {productLoading
                ? "..."
                : totalProducts}
            </h2>

          </div>

          {/* IN STOCK */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <p className="text-slate-500 text-sm">
              In Stock
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {productLoading
                ? "..."
                : inStockProducts.length}
            </h2>

          </div>

          {/* LOW STOCK */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <Link
  to="/admin/products?stock=low"
  className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition"
>
  <p className="text-sm font-semibold text-slate-500">
    Low Stock
  </p>

  <p className="text-3xl font-bold text-orange-600 mt-2">
    {lowStockProducts.length}
  </p>

  <p className="text-sm text-slate-500 mt-1">
    Click to manage
  </p>
</Link>

          </div>

          {/* OUT OF STOCK */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <Link
  to="/admin/products?stock=out"
  className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition"
>
  <p className="text-sm font-semibold text-slate-500">
    Out of Stock
  </p>

  <p className="text-3xl font-bold text-red-600 mt-2">
    {outOfStockProducts.length}
  </p>

  <p className="text-sm text-slate-500 mt-1">
    Click to manage
  </p>
</Link>

          </div>

        </div>

        {/* =================================
            PRODUCT SEARCH
        ================================= */}

        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Product Search
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Search products by name or category.
              </p>

            </div>

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full md:w-80 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* SEARCH RESULTS */}

          {searchTerm && (

            <div className="mt-6 border-t border-slate-200 pt-5">

              {searchResults.length === 0 ? (

                <p className="text-slate-500">
                  No products found.
                </p>

              ) : (

                <div className="space-y-3">

                  {searchResults
                    .slice(0, 5)
                    .map((product) => (

                      <div
                        key={product._id}
                        className="flex items-center justify-between bg-slate-50 rounded-lg p-4"
                      >

                        <div>

                          <p className="font-semibold text-slate-900">
                            {product.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {product.category}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="font-semibold text-blue-600">
                            LKR{" "}
                            {Number(
                              product.price || 0
                            ).toLocaleString()}
                          </p>

                          <p className="text-xs text-slate-500">
                            Stock:{" "}
                            {product.stock ?? 0}
                          </p>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </div>

          )}

        </div>

        {/* =================================
            CATEGORY BREAKDOWN
        ================================= */}

        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">

          <h2 className="text-xl font-bold text-slate-900">
            Category Breakdown
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Number of products in each category.
          </p>

          <div className="mt-6 space-y-5">

            {Object.entries(categoryCounts).length === 0 ? (

              <p className="text-slate-500">
                {productLoading
                  ? "Loading categories..."
                  : "No categories available."}
              </p>

            ) : (

              Object.entries(categoryCounts).map(
                ([category, count]) => {

                  const percentage =
                    totalProducts > 0
                      ? (count / totalProducts) * 100
                      : 0;

                  return (

                    <div key={category}>

                      <div className="flex justify-between mb-2">

                        <span className="font-medium text-slate-700">
                          {category}
                        </span>

                        <span className="text-sm text-slate-500">
                          {count} products
                        </span>

                      </div>

                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  );
                }
              )

            )}

          </div>

        </div>

        {/* =================================
            CUSTOMER INQUIRIES
        ================================= */}

        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-slate-500 text-sm">
                Customer Inquiries
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {inquiryLoading
                  ? "..."
                  : totalInquiries}
              </h2>

              <div className="flex flex-wrap gap-5 mt-3">

                <span className="text-sm text-blue-600 font-medium">
                  New: {newInquiries}
                </span>

                <span className="text-sm text-green-600 font-medium">
                  Read: {readInquiries}
                </span>

              </div>

            </div>

            <Link
              to="/admin/inquiries"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              View Inquiries
            </Link>

          </div>

        </div>

        {/* =================================
            QUICK ACTIONS
        ================================= */}

        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">

          <h2 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="flex flex-wrap gap-4 mt-5">

            <Link
              to="/admin/products/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              + Add Product
            </Link>

            <Link
              to="/admin/products"
              className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 px-5 py-3 rounded-lg font-semibold transition"
            >
              Manage Products
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
