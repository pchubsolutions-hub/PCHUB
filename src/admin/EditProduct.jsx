import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  // Get existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Product not found");
        }

        const product = data.product;

        setFormData({
          name: product.name || "",
          category: product.category || "Laptops",
          description: product.description || "",
          price: product.price || "",
          image: product.image || "",
          stock: product.stock || "",

          processor: product.specifications?.processor || "",
          ram: product.specifications?.ram || "",
          storage: product.specifications?.storage || "",
          graphics: product.specifications?.graphics || "",
          display: product.specifications?.display || "",
          operatingSystem:
            product.specifications?.operatingSystem || "",
        });

        // Show existing image
        if (product.image) {
          setImagePreview(product.image);
        }
      } catch (error) {
        console.error("Fetch Product Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check image type
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

    // Preview selected image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!selectedImage) {
      return formData.image;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration is missing. Please check environment variables."
      );
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();

      uploadData.append("file", selectedImage);
      uploadData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Image upload failed"
        );
      }

      return data.secure_url;
    } finally {
      setUploadingImage(false);
    }
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      // Upload new image only if user selected one
      const imageUrl = await uploadImage();

      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        image: imageUrl,
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

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error(
          "Admin authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          method: "PUT",
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
          data.message || "Failed to update product"
        );
      }

      alert("Product updated successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("Update Product Error:", error);

      setError(
        error.message || "Failed to update product"
      );
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="text-slate-500 mt-4">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error && !formData.name) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Product Not Found
        </h1>

        <p className="text-red-600 mt-3">
          {error}
        </p>

        <button
          onClick={() => navigate("/admin/products")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          PCHUB ADMIN
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
          Edit Product
        </h1>

        <p className="text-slate-500 mt-2">
          Update product information.
        </p>
      </div>

      {/* Error */}
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
            Update the main product information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              min="0"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="text-xs text-slate-500 mt-2">
              Select a new image only if you want to replace the current image. Maximum 5MB.
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Image Preview
                </p>

                <div className="w-full h-52 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                {selectedImage && (
                  <p className="text-xs text-slate-500 mt-2">
                    New image selected: {selectedImage.name}
                  </p>
                )}
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

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Processor
              </label>

              <input
                type="text"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                RAM
              </label>

              <input
                type="text"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Storage
              </label>

              <input
                type="text"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Graphics
              </label>

              <input
                type="text"
                name="graphics"
                value={formData.graphics}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Display
              </label>

              <input
                type="text"
                name="display"
                value={formData.display}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Operating System
              </label>

              <input
                type="text"
                name="operatingSystem"
                value={formData.operatingSystem}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="border-t border-slate-200 mt-10 pt-8 flex gap-4">

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-7 py-3 rounded-lg font-semibold transition"
          >
            {uploadingImage
              ? "Uploading Image..."
              : saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 px-7 py-3 rounded-lg font-semibold"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditProduct;