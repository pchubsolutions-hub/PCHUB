import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      icon: "🛠️",
      title: "Computer Repair",
      description:
        "Professional troubleshooting and repair services for desktop computers and laptops.",
    },
    {
      icon: "💻",
      title: "Laptop & PC Upgrades",
      description:
        "Upgrade RAM, SSD, graphics cards and other components to improve your system performance.",
    },
    {
      icon: "🌐",
      title: "Networking Solutions",
      description:
        "Basic network setup, Wi-Fi configuration, router installation and small office networking solutions.",
    },
    {
      icon: "⚙️",
      title: "Operating System Installation",
      description:
        "Windows and other operating system installation, configuration and driver setup.",
    },
    {
      icon: "🔒",
      title: "Security & Maintenance",
      description:
        "System security checks, malware protection, software updates and regular computer maintenance.",
    },
    {
      icon: "💾",
      title: "Data Backup & Recovery",
      description:
        "Help with data backup solutions, storage setup and recovery of important files when possible.",
    },
    {
      icon: "🎮",
      title: "Gaming PC Setup",
      description:
        "Gaming PC assembly, component selection, system configuration and performance optimization.",
    },
    {
      icon: "🏢",
      title: "Business IT Support",
      description:
        "Technology support for small businesses including computers, networking and IT equipment.",
    },
  ];

  const process = [
    {
      number: "01",
      title: "Understand",
      description:
        "We first understand your computer or technology requirement.",
    },
    {
      number: "02",
      title: "Diagnose",
      description:
        "We identify the issue and determine the most suitable solution.",
    },
    {
      number: "03",
      title: "Solve",
      description:
        "Our team works on the required repair, installation or configuration.",
    },
    {
      number: "04",
      title: "Support",
      description:
        "We provide guidance to help you keep your system working properly.",
    },
  ];

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
          <div className="max-w-3xl">

            <p className="text-blue-400 font-semibold uppercase tracking-wider mb-4">
              PCHUB SERVICES
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Technology
              <span className="text-blue-500"> Services </span>
              You Can Rely On
            </h1>

            <p className="text-slate-400 text-lg leading-8 mt-6">
              From computer repairs and upgrades to networking and business
              IT support, PCHUB provides practical technology services for
              individuals and businesses.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-lg font-semibold transition"
              >
                Request a Service
              </Link>

              <Link
                to="/products"
                className="border border-slate-600 hover:border-blue-500 hover:bg-slate-900 text-white px-7 py-3.5 rounded-lg font-semibold transition"
              >
                View Products
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-blue-600 font-semibold mb-3">
              WHAT WE DO
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Technology Services
            </h2>

            <p className="text-slate-500 mt-4 leading-7">
              Practical and reliable technology services to help keep your
              computers and IT systems running smoothly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {services.map((service) => (
              <div
                key={service.title}
                className="group border border-slate-200 rounded-2xl p-7 hover:border-blue-500 hover:shadow-xl transition duration-300"
              >

                <div className="w-14 h-14 flex items-center justify-center bg-blue-50 rounded-xl text-2xl group-hover:bg-blue-600 transition duration-300">
                  {service.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-6">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-sm leading-7 mt-3">
                  {service.description}
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 font-semibold text-sm mt-5 hover:text-blue-700"
                >
                  Get Service
                  <span className="ml-2">→</span>
                </Link>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Featured Service */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Image */}
            <div className="bg-slate-200 rounded-3xl overflow-hidden">
              <img
                src="/images/hero/hero-gaming.jpg"
                alt="PCHUB Computer Services"
                className="w-full h-[420px] object-cover"
              />
            </div>

            {/* Content */}
            <div>

              <p className="text-blue-600 font-semibold mb-3">
                COMPLETE IT SUPPORT
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                From Setup to
                <span className="text-blue-600"> Support</span>
              </h2>

              <p className="text-slate-600 leading-8 mt-6">
                Whether you are setting up a new computer, upgrading an
                existing system or solving a technical problem, PCHUB can
                help you find a practical solution.
              </p>

              <div className="space-y-4 mt-7">

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Professional Assistance
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Get help with common computer and technology issues.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Practical Solutions
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Solutions focused on your actual requirements and
                      budget.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Customer Support
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Friendly assistance before and after your service.
                    </p>
                  </div>
                </div>

              </div>

              <Link
                to="/contact"
                className="inline-flex mt-8 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-lg font-semibold transition"
              >
                Talk to Our Team
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="text-blue-600 font-semibold mb-3">
              OUR PROCESS
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              How We Work
            </h2>

            <p className="text-slate-500 mt-4 leading-7">
              A simple process to understand your requirement and provide
              the right technology solution.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {process.map((item) => (
              <div
                key={item.number}
                className="relative border border-slate-200 rounded-2xl p-7"
              >

                <span className="text-5xl font-bold text-blue-100">
                  {item.number}
                </span>

                <h3 className="text-xl font-bold text-slate-900 mt-4">
                  {item.title}
                </h3>

                <p className="text-slate-500 text-sm leading-7 mt-3">
                  {item.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-blue-600 rounded-3xl px-8 py-14 md:px-16 text-center text-white">

            <p className="text-blue-100 font-semibold">
              NEED TECHNICAL HELP?
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Let's Solve Your Technology Problem
            </h2>

            <p className="text-blue-100 max-w-2xl mx-auto mt-4 leading-7">
              Contact PCHUB today and tell us what you need help with.
              Our team can help you find the right solution.
            </p>

            <Link
              to="/contact"
              className="inline-flex mt-8 bg-white text-blue-600 hover:bg-slate-100 px-7 py-3.5 rounded-lg font-semibold transition"
            >
              Contact PCHUB
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Services;