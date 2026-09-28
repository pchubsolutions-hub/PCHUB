import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import PageTitle from "../components/PageTitle";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Laptops",
    "Desktop PCs",
    "Components",
    "Monitors",
    "Accessories",
  ];

  // Fetch products from backend
  useEffect(() => {
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
        console.error("Product Fetch Error:", error);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state
  if (loading) {
    return <Loading text="Loading products..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Products unavailable"
        message={error}
      />
    );
  }

  // Filter products
  const filteredProducts = [...products]
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Low Price → High Price
      if (priceFilter === "low") {
        return Number(a.price) - Number(b.price);
      }

      // High Price → Low Price
      if (priceFilter === "high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  return (
    <div className="bg-white min-h-screen">
      <PageTitle title="Products" />

      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-blue-400 font-semibold uppercase tracking-wider mb-4">
            PCHUB PRODUCTS
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Find the Right
            <span className="text-blue-500"> Technology</span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto mt-5 leading-7">
            Explore our range of laptops, desktop computers, components,
            monitors and accessories.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Price Filter */}
            <div className="md:ml-4">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="default">
                  Price: Default
                </option>

                <option value="low">
                  Price: Low → High
                </option>

                <option value="high">
                  Price: High → Low
                </option>
              </select>
            </div>

          </div>

          {/* Product Count */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-slate-500 text-sm">
                Showing {filteredProducts.length} products
              </p>
            </div>

            <p className="text-slate-900 font-semibold">
              {selectedCategory}
            </p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition duration-300"
                >

                  {/* Image */}
                  <div className="bg-slate-100 h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">

                    <p className="text-blue-600 text-sm font-semibold">
                      {product.category}
                    </p>

                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                      {product.name}
                    </h3>

                    <p className="text-slate-500 text-sm leading-6 mt-2 min-h-[48px]">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-5">

                      <p className="text-xl font-bold text-slate-900">
                        Rs. {Number(product.price).toLocaleString()}
                      </p>

                      <Link
                        to={`/products/${product._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        View Details
                      </Link>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-20">

              <div className="text-5xl mb-5">
                🔍
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                No Products Found
              </h2>

              <p className="text-slate-500 mt-2">
                Try another product name or category.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setPriceFilter("default");
                }}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                View All Products
              </button>

            </div>
          )}

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-slate-950 rounded-3xl px-8 py-14 md:px-16 text-center text-white">

            <p className="text-blue-400 font-semibold">
              NEED HELP?
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Not Sure What You Need?
            </h2>

            <p className="text-slate-400 max-w-2xl mx-auto mt-4 leading-7">
              Contact PCHUB and our team can help you choose the right
              computer, component or accessory for your requirements.
            </p>

            <Link
              to="/contact"
              className="inline-flex mt-8 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-lg font-semibold transition"
            >
              Contact PCHUB
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Products;