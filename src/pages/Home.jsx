import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";



function Home() {
  const categories = [
    {
      name: "Laptops",
      icon: "💻",
      description: "Work, study & everyday laptops",
    },
    {
      name: "Desktop PCs",
      icon: "🖥️",
      description: "Powerful desktop computers",
    },
    {
      name: "Gaming",
      icon: "🎮",
      description: "Gaming PCs & accessories",
    },
    {
      name: "Components",
      icon: "⚙️",
      description: "PC parts & upgrades",
    },
    {
      name: "Monitors",
      icon: "🖵",
      description: "Displays for work & gaming",
    },
    {
      name: "Accessories",
      icon: "⌨️",
      description: "Keyboard, mouse & more",
    },
  ];

  const products = [
    {
      name: "Gaming Laptop",
      category: "Laptops",
      price: "Rs. 245,000",
      icon: "💻",
    },
    {
      name: "Gaming Desktop",
      category: "Desktop PCs",
      price: "Rs. 325,000",
      icon: "🖥️",
    },
    {
      name: "RTX Graphics Card",
      category: "Components",
      price: "Rs. 185,000",
      icon: "🎮",
    },
    {
      name: "Gaming Monitor",
      category: "Monitors",
      price: "Rs. 85,000",
      icon: "🖵",
    },
  ];

  const services = [
    {
      title: "PC Repair",
      description:
        "Professional computer troubleshooting and repair services.",
      icon: "🔧",
    },
    {
      title: "Custom PC Build",
      description:
        "Build a PC according to your performance and budget requirements.",
      icon: "🛠️",
    },
    {
      title: "Laptop Service",
      description:
        "Laptop maintenance, upgrades, cleaning and troubleshooting.",
      icon: "💻",
    },
  ];

  return (
    
    <div className="bg-white">
        <PageTitle title="Computer Store" />

      {/* ================= HERO ================= */}
      <section className="bg-slate-950 text-white">

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Hero Content */}
            <div>

              <span className="inline-block bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full text-sm font-medium mb-6">
                Your Trusted Technology Partner
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Power Your
                <span className="text-blue-500"> Digital World</span>
              </h1>

              <p className="text-gray-400 text-lg mt-6 max-w-xl leading-8">
                Discover quality computers, laptops, components and
                accessories at PCHUB. Everything you need for work,
                study, gaming and business.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <Link
                  to="/products"
                  className="bg-blue-600 hover:bg-blue-700 px-7 py-3.5 rounded-lg font-semibold transition"
                >
                  Shop Products
                </Link>

                <Link
                  to="/contact"
                  className="border border-gray-600 hover:border-blue-500 px-7 py-3.5 rounded-lg font-semibold transition"
                >
                  Contact Us
                </Link>

              </div>

            </div>

            {/* Hero Visual */}
            <div className="flex justify-center">

              <div className="relative">

                <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full"></div>

                <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-12 md:p-16">

                  <img
  src="/Images/logo/pchub-logo.png"
  alt="PCHUB Computers"
  className="w-full h-[420px] object-cover rounded-2xl"
/>

                  <div className="text-center mt-6">

                    <p className="text-xl font-bold">
                      PCHUB
                    </p>

                    <p className="text-gray-400 text-sm mt-2">
                      Computers • Components • Technology
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <p className="text-blue-600 font-semibold mb-2">
              EXPLORE
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shop by Category
            </h2>

            <p className="text-gray-500 mt-4">
              Find the right technology for your needs.
            </p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

            {categories.map((category) => (
              <Link
                key={category.name}
                to="/products"
                className="group border border-gray-200 rounded-2xl p-6 text-center hover:border-blue-500 hover:shadow-lg transition"
              >

                <div className="text-4xl mb-4">
                  {category.icon}
                </div>

                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {category.name}
                </h3>

                <p className="text-xs text-gray-500 mt-2">
                  {category.description}
                </p>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">

            <div>

              <p className="text-blue-600 font-semibold mb-2">
                FEATURED
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Products
              </h2>

            </div>

            <Link
              to="/products"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              View All Products →
            </Link>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition"
              >

                {/* Product Image Placeholder */}
                <div className="h-52 bg-gray-100 flex items-center justify-center">

                  <span className="text-7xl">
                    {product.icon}
                  </span>

                </div>

                <div className="p-5">

                  <p className="text-sm text-blue-600 font-medium">
                    {product.category}
                  </p>

                  <h3 className="font-bold text-lg text-gray-900 mt-1">
                    {product.name}
                  </h3>

                  <p className="text-xl font-bold text-gray-900 mt-4">
                    {product.price}
                  </p>

                  <button className="w-full mt-5 bg-gray-900 text-white py-3 rounded-lg hover:bg-blue-600 transition">
                    View Product
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <p className="text-blue-600 font-semibold mb-2">
              WHAT WE DO
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Services
            </h2>

            <p className="text-gray-500 mt-4">
              More than just a computer shop.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {services.map((service) => (
              <div
                key={service.title}
                className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-blue-500 transition"
              >

                <div className="text-4xl mb-5">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="text-gray-500 mt-3 leading-7">
                  {service.description}
                </p>

                <Link
                  to="/services"
                  className="inline-block text-blue-600 font-semibold mt-5"
                >
                  Learn More →
                </Link>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================= WHY PCHUB ================= */}
      <section className="bg-slate-950 text-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>

              <p className="text-blue-400 font-semibold mb-3">
                WHY PCHUB
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Technology You Can Trust
              </h2>

              <p className="text-gray-400 mt-5 leading-8">
                We focus on providing reliable products, helpful
                service and technology solutions for our customers.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-3xl">✓</div>
                <h3 className="font-bold mt-4">
                  Quality Products
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Carefully selected computer products.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-3xl">🛡️</div>
                <h3 className="font-bold mt-4">
                  Warranty Support
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Customer-focused after-sales support.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-3xl">🔧</div>
                <h3 className="font-bold mt-4">
                  Expert Service
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Professional technical assistance.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-3xl">🚚</div>
                <h3 className="font-bold mt-4">
                  Islandwide Delivery
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Convenient delivery options across Sri Lanka.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="py-20">

        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-blue-600 rounded-3xl px-8 py-14 text-center text-white">

            <h2 className="text-3xl md:text-4xl font-bold">
              Looking for the Right PC?
            </h2>

            <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
              Talk to our team and find the right computer,
              components or technology solution for your needs.
            </p>

            <Link
              to="/contact"
              className="inline-block mt-8 bg-white text-blue-600 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Talk to Us
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;