import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import PageTitle from "../components/PageTitle";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product from MongoDB
  useEffect(() => {
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("Product ID:", id);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data.product);
      } catch (error) {
        console.error("Product Details Error:", error);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading
  if (loading) {
    return <Loading text="Loading product details..." />;
  }

  // Error
  if (error || !product) {
    return (
      <ErrorState
        title="Product Not Found"
        message={error || "This product does not exist."}
      />
    );
  }

  return (
    <div className="bg-white min-h-screen">

      <PageTitle title={product.name} />

      {/* Breadcrumb */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Link
              to="/"
              className="hover:text-blue-400 transition"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/products"
              className="hover:text-blue-400 transition"
            >
              Products
            </Link>

            <span>/</span>

            <span className="text-white">
              {product.name}
            </span>
          </div>

        </div>
      </section>

      {/* Product Details */}
      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Product Image */}
            <div>

              <div className="bg-slate-100 rounded-2xl overflow-hidden">

              <img
  src={product.image || "/images/products/default-product.jpg"}
  alt={product.name}
  className="w-full h-[500px] object-cover"
/>

              </div>

            </div>

            {/* Product Information */}
            <div>

              <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
                {product.category}
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
                {product.name}
              </h1>

              <p className="text-3xl font-bold text-blue-600 mt-6">
                Rs. {Number(product.price).toLocaleString()}
              </p>

              <p className="text-slate-600 leading-7 mt-6">
                {product.description}
              </p>

              {/* Stock */}
              <div className="mt-6">

                {product.stock > 0 ? (
                  <span className="inline-flex bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="inline-flex bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
                    Out of Stock
                  </span>
                )}

              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">

                <a
                  href="https://wa.me/94112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-lg font-semibold transition"
                >
                  WhatsApp Inquiry
                </a>

                <Link
                  to="/contact"
                  className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 px-7 py-3.5 rounded-lg font-semibold transition"
                >
                  Contact Us
                </Link>

              </div>

            </div>

          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="mt-16">

                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Specifications
                </h2>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">

                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 md:grid-cols-3 border-b last:border-b-0 border-slate-200"
                      >

                        <div className="bg-slate-50 px-6 py-4 font-semibold text-slate-700 capitalize">
                          {key}
                        </div>

                        <div className="md:col-span-2 px-6 py-4 text-slate-600">
                          {value}
                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          {/* Back to Products */}
          <div className="mt-12">

            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Products
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ProductDetails;