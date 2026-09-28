import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";

function About() {
  const features = [
    {
      icon: "💻",
      title: "Quality Technology",
      description:
        "We aim to provide reliable computers, components and accessories for different customer needs.",
    },
    {
      icon: "🔧",
      title: "Technical Support",
      description:
        "Our services focus on helping customers with computer setup, troubleshooting, upgrades and maintenance.",
    },
    {
      icon: "🛡️",
      title: "Customer Focus",
      description:
        "We believe in providing friendly support and practical technology solutions for our customers.",
    },
    {
      icon: "⚡",
      title: "Modern Solutions",
      description:
        "We keep our product and service approach focused on current computer and technology requirements.",
    },
  ];

  return (
    <div className="bg-white">
        <PageTitle title="PC HUB" />

      {/* ================= HERO ================= */}
      <section className="bg-slate-950 text-white">

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">

          <div className="max-w-3xl">

            <p className="text-blue-400 font-semibold uppercase tracking-wider mb-4">
              About PCHUB
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Technology That Helps You
              <span className="text-blue-500"> Move Forward</span>
            </h1>

            <p className="text-gray-400 text-lg leading-8 mt-6">
              PCHUB is a computer and technology store focused on
              providing computers, components, accessories and
              technology services for individuals and businesses.
            </p>

          </div>

        </div>

      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Image */}
            <div className="relative">

              <div className="bg-slate-100 rounded-3xl overflow-hidden">

                <img
                  src="public\Images\hero\hero-main.jpg"
                  alt="PCHUB Technology"
                  className="w-full h-[420px] object-cover"
                />

              </div>

              {/* Small Card */}
              <div className="absolute -bottom-6 -right-4 md:right-6 bg-blue-600 text-white rounded-2xl px-6 py-5 shadow-xl">

                <p className="text-3xl font-bold">
                  PCHUB
                </p>

                <p className="text-blue-100 text-sm mt-1">
                  Computer & Technology
                </p>

              </div>

            </div>

            {/* Content */}
            <div>

              <p className="text-blue-600 font-semibold mb-3">
                WHO WE ARE
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Your Trusted Computer & Technology Partner
              </h2>

              <p className="text-slate-600 leading-8 mt-6">
                At PCHUB, we believe technology should be accessible,
                reliable and suitable for real-world needs. We provide
                a range of computer products and services designed
                for students, professionals, gamers, home users and
                businesses.
              </p>

              <p className="text-slate-600 leading-8 mt-4">
                From selecting the right computer to upgrading
                components or getting technical support, our goal is
                to make your technology experience simple and
                dependable.
              </p>

              <Link
                to="/products"
                className="inline-flex mt-7 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-lg font-semibold transition"
              >
                Explore Our Products
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ================= MISSION / VISION ================= */}
      <section className="bg-slate-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-8">

            {/* Mission */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10">

              <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl text-2xl mb-6">
                🎯
              </div>

              <p className="text-blue-600 font-semibold mb-2">
                OUR MISSION
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                Making Technology Simple
              </h2>

              <p className="text-slate-600 leading-8 mt-4">
                Our mission is to provide quality technology products
                and dependable services while helping customers find
                solutions that match their requirements and budget.
              </p>

            </div>

            {/* Vision */}
            <div className="bg-slate-950 text-white rounded-2xl p-8 md:p-10">

              <div className="w-14 h-14 flex items-center justify-center bg-blue-600 rounded-xl text-2xl mb-6">
                👁️
              </div>

              <p className="text-blue-400 font-semibold mb-2">
                OUR VISION
              </p>

              <h2 className="text-2xl font-bold">
                Building a Trusted Technology Brand
              </h2>

              <p className="text-slate-400 leading-8 mt-4">
                Our vision is to build a trusted technology brand
                recognized for quality products, useful services and
                positive customer experiences.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= WHY PCHUB ================= */}
      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <p className="text-blue-600 font-semibold mb-3">
              WHY PCHUB
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose PCHUB?
            </h2>

            <p className="text-slate-500 mt-4 leading-7">
              We focus on quality, service and practical technology
              solutions.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="group border border-slate-200 rounded-2xl p-7 hover:border-blue-500 hover:shadow-lg transition"
              >

                <div className="w-14 h-14 flex items-center justify-center bg-blue-50 rounded-xl text-2xl group-hover:bg-blue-600 transition">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-5">
                  {feature.title}
                </h3>

                <p className="text-slate-500 text-sm leading-7 mt-3">
                  {feature.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="pb-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-blue-600 rounded-3xl px-8 py-14 md:px-16 text-center text-white">

            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Find Your Next Computer?
            </h2>

            <p className="text-blue-100 max-w-2xl mx-auto mt-4 leading-7">
              Explore our products or contact our team to find the
              right technology solution for your requirements.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">

              <Link
                to="/products"
                className="bg-white text-blue-600 px-7 py-3.5 rounded-lg font-semibold hover:bg-slate-100 transition"
              >
                View Products
              </Link>

              <Link
                to="/contact"
                className="border border-blue-300 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default About;