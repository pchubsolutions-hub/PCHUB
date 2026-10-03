import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Laptops",
    description: "",
    price: "",
    image: "",
    stock: "",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    display: "",
    operatingSystem: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // IMAGE SELECT
  // ==============================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Allow only image files
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");

    setSelectedImage(file);

    // Preview image
    const previewURL = URL.createObjectURL(file);

    setImagePreview(previewURL);
  };

  // ==============================
  // UPLOAD IMAGE TO CLOUDINARY
  // ==============================

  const uploadImage = async () => {
    if (!selectedImage) {
      return formData.image;
    }

    setUploadingImage(true);

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset =
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary configuration is missing."
        );
      }

      const imageData = new FormData();

      imageData.append("file", selectedImage);
      imageData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Image upload failed."
        );
      }

      return data.secure_url;

    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw error;

    } finally {
      setUploadingImage(false);
    }
  };

  // ==============================
  // SUBMIT PRODUCT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Get admin JWT token
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin authentication required. Please login again."
        );
      }

      // Upload image first
      const imageURL = await uploadImage();

      // Prepare product data
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        image: imageURL,
        stock: Number(formData.stock),

        specifications: {
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
          graphics: formData.graphics,
          display: formData.display,
          operatingSystem: formData.operatingSystem,
        },
      };

      // Send product to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      console.log("Product created:", data);

      setMessage("Product added successfully!");

      // Reset form
      setFormData({
        name: "",
        category: "Laptops",
        description: "",
        price: "",
        image: "",
        stock: "",
        processor: "",
        ram: "",
        storage: "",
        graphics: "",
        display: "",
        operatingSystem: "",
      });

      setSelectedImage(null);
      setImagePreview("");

      // Go to Manage Products
      setTimeout(() => {
        navigate("/admin/products");
      }, 1200);

    } catch (error) {
      console.error("Add Product Error:", error);

      setError(
        error.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          PCHUB ADMIN
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
          Add Product
        </h1>

        <p className="text-slate-500 mt-2">
          Add a new product to the PCHUB store.
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-5 py-4 rounded-lg">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-5 py-4 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8"
      >

        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Basic Information
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Enter the main product information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: ASUS TUF Gaming A15"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Laptops">Laptops</option>
              <option value="Desktop PCs">Desktop PCs</option>
              <option value="Components">Components</option>
              <option value="Monitors">Monitors</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Price (LKR) *
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="285000"
              min="0"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Stock *
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="10"
              min="0"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product Image *
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="text-xs text-slate-500 mt-2">
              JPG, PNG, WEBP • Maximum 5MB
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Image Preview
                </p>

                <div className="w-48 h-48 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {selectedImage?.name}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              rows="5"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="border-t border-slate-200 mt-10 pt-8">

          <h2 className="text-xl font-bold text-slate-900">
            Specifications
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Add technical specifications of the product.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            {/* Processor */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Processor
              </label>

              <input
                type="text"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="AMD Ryzen 7"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* RAM */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                RAM
              </label>

              <input
                type="text"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                placeholder="16GB DDR5"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Storage */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Storage
              </label>

              <input
                type="text"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                placeholder="512GB NVMe SSD"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Graphics */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Graphics
              </label>

              <input
                type="text"
                name="graphics"
                value={formData.graphics}
                onChange={handleChange}
                placeholder="NVIDIA GeForce RTX 4060"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Display */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Display
              </label>

              <input
                type="text"
                name="display"
                value={formData.display}
                onChange={handleChange}
                placeholder="15.6 inch FHD 144Hz"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* OS */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Operating System
              </label>

              <input
                type="text"
                name="operatingSystem"
                value={formData.operatingSystem}
                onChange={handleChange}
                placeholder="Windows 11"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="border-t border-slate-200 mt-10 pt-8 flex flex-wrap gap-4">

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-7 py-3 rounded-lg font-semibold transition"
          >
            {uploadingImage
              ? "Uploading Image..."
              : loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 px-7 py-3 rounded-lg font-semibold transition"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
}

export default AddProduct;