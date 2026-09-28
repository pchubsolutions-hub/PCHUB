import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/inquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit inquiry."
        );
      }

      setSuccess(
        "Your inquiry has been submitted successfully. We will contact you soon."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Inquiry submit error:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}

      <section className="bg-slate-950 text-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">
            Contact PCHUB
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Get in Touch
          </h1>

          <p className="text-slate-300 mt-5 max-w-2xl">
            Have a question about a product, PC build, upgrade,
            repair or any of our services? Send us a message.
          </p>

        </div>

      </section>

      {/* Contact Section */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Contact Information */}

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Contact Information
              </h2>

              <p className="text-slate-600 mt-3 leading-7">
                Our team is ready to help you with your computer
                hardware, software and technology requirements.
              </p>

              <div className="mt-8 space-y-5">

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Phone
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    +94 77 123 4567
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    info@pchub.lk
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Location
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    Sri Lanka
                  </p>
                </div>

              </div>

            </div>

            {/* Contact Form */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">

              <h2 className="text-2xl font-bold text-slate-900">
                Send an Inquiry
              </h2>

              <p className="text-slate-500 mt-2">
                Fill out the form and our team will get back to you.
              </p>

              {/* Success */}

              {success && (
                <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Error */}

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >

                {/* Name */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Phone */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="07X XXXXXXX"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Subject */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject *
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What can we help you with?"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Message */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Write your message..."
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  />

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
                >
                  {loading
                    ? "Sending..."
                    : "Send Inquiry"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Contact;
