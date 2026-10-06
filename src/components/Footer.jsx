function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              PCHUB
            </h2>

            <p className="text-gray-400 leading-7">
              Your trusted computer and technology partner.
              We provide quality computer products and
              reliable IT services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <a href="/" className="hover:text-white transition">
                Home
              </a>

              <a href="/about" className="hover:text-white transition">
                About
              </a>

              <a href="/products" className="hover:text-white transition">
                Products
              </a>

              <a href="/services" className="hover:text-white transition">
                Services
              </a>

              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-gray-400">

              <p>📞 +94 75 166 3654</p>

              <p>✉ pchubsolutions@gmail.com</p>

              <p>📍 No:148, Uggalbada, Kalutara, Sri Lanka</p>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-6 py-5 text-center">

          <p className="text-gray-500 text-sm">
            © 2026 PCHUB. All Rights Reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;