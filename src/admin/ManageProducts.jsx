import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("default");
  const [stockFilter, setStockFilter] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch Products Error:", error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchProducts();
}, []);

useEffect(() => {
  const stock = searchParams.get("stock");

  if (stock === "low") {
    setStockFilter("Low Stock");
  } else if (stock === "out") {
    setStockFilter("Out of Stock");
  } else {
    setStockFilter("All");
  }
}, [searchParams]);

 const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      throw new Error(
        "Admin authentication required. Please login again."
      );
    }

    const response = await fetch(
      `http://localhost:5000/api/products/${id}`,
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
        data.message || "Failed to delete product"
      );
    }

    // Remove deleted product from current list
    setProducts((prevProducts) =>
      prevProducts.filter(
        (product) => product._id !== id
      )
    );

  } catch (error) {
    console.error("Delete Product Error:", error);
    alert(error.message || "Something went wrong");
  }
};

  // Get unique categories
  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // Apply filters
  const filteredProducts = [...products]
    .filter((product) => {
      // Category filter
      if (
        categoryFilter !== "All" &&
        product.category !== categoryFilter
      ) {
        return false;
      }

      // Stock filter
      if (stockFilter === "In Stock") {
        return Number(product.stock) > 0;
      }

      if (stockFilter === "Low Stock") {
        return (
          Number(product.stock) > 0 &&
          Number(product.stock) <= 5
        );
      }

      if (stockFilter === "Out of Stock") {
        return Number(product.stock) === 0;
      }

      return true;
    })
    .sort((a, b) => {
      // Price Low → High
      if (priceFilter === "low") {
        return Number(a.price) - Number(b.price);
      }

      // Price High → Low
      if (priceFilter === "high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

        <div>
          <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            PCHUB ADMIN
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Manage Products
          </h1>

          <p className="text-slate-500 mt-2">
            View, edit and delete PCHUB products.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Product
        </Link>

      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="text-slate-500 mt-4">
            Loading products...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products */}
      {!loading && !error && (
        <>
          {/* Product Count */}
          <div className="mb-5">
            <p className="text-slate-500">
              Showing:{" "}
              <span className="font-bold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              / {products.length} Products
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">

            <div className="flex flex-col lg:flex-row gap-4">

              {/* Category */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price
                </label>

                <select
                  value={priceFilter}
                  onChange={(e) =>
                    setPriceFilter(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="default">
                    Default
                  </option>

                  <option value="low">
                    Low Price → High Price
                  </option>

                  <option value="high">
                    High Price → Low Price
                  </option>
                </select>
              </div>

              {/* Stock */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Stock
                </label>

                <select
                  value={stockFilter}
                  onChange={(e) =>
                    setStockFilter(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">
                    All Stock
                  </option>

                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Low Stock">
                    Low Stock
                  </option>

                  <option value="Out of Stock">
                    Out of Stock
                  </option>
                </select>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setCategoryFilter("All");
                    setPriceFilter("default");
                    setStockFilter("All");
                  }}
                  className="w-full lg:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-semibold transition"
                >
                  Reset Filters
                </button>
              </div>

            </div>

          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

              <div className="text-5xl mb-5">
                📦
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                No Products Found
              </h2>

              <p className="text-slate-500 mt-2">
                You haven't added any products yet.
              </p>

              <Link
                to="/admin/products/add"
                className="inline-flex mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Add Your First Product
              </Link>

            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

              <div className="text-5xl mb-5">
                🔍
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                No Matching Products
              </h2>

              <p className="text-slate-500 mt-2">
                No products match the selected filters.
              </p>

              <button
                onClick={() => {
                  setCategoryFilter("All");
                  setPriceFilter("default");
                  setStockFilter("All");
                }}
                className="inline-flex mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Reset Filters
              </button>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

              {/* Desktop Table */}
              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Product
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Category
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Price
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Stock
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                        Actions
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
                      >

                        {/* Product */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">

                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  No Image
                                </div>
                              )}

                            </div>

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {product.name}
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                ID: {product._id}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Category */}
                        <td className="px-6 py-5">

                          <span className="inline-flex bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            {product.category}
                          </span>

                        </td>

                        {/* Price */}
                        <td className="px-6 py-5">

                          <span className="font-semibold text-slate-900">
                            Rs.{" "}
                            {Number(
                              product.price
                            ).toLocaleString()}
                          </span>

                        </td>

                        {/* Stock */}
                        <td className="px-6 py-5">

                          {product.stock > 0 ? (
                            <span className="inline-flex bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {product.stock} In Stock
                            </span>
                          ) : (
                            <span className="inline-flex bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                              Out of Stock
                            </span>
                          )}

                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/products/${product._id}`}
                              className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition"
                            >
                              View
                            </Link>

                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(product._id)
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
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
        </>
      )}

    </div>
  );
}

export default ManageProducts;