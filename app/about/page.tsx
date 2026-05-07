import Link from "next/link";

const stats = [
  { value: "50+", label: "Product SKUs" },
  { value: "20+", label: "Countries Served" },
  { value: "1000+", label: "Tons Monthly" },
  { value: "99%", label: "On-time Delivery" },
];

const values = [
  {
    title: "Quality First",
    description:
      "Every product undergoes rigorous quality testing before shipment. We partner only with certified manufacturers.",
  },
  {
    title: "Customer Focus",
    description:
      "We build long-term partnerships by understanding each customer's unique needs and delivering tailored solutions.",
  },
  {
    title: "Innovation",
    description:
      "We leverage technology to streamline sourcing, logistics, and communication for a seamless trading experience.",
  },
  {
    title: "Integrity",
    description:
      "Transparent pricing, honest communication, and reliable delivery are the cornerstones of our business.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-primary to-primary-light py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            About SL Trade
          </h1>
          <p className="mt-3 text-white/70 max-w-xl">
            Your trusted partner for premium plastic raw materials in Africa.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bridging China&apos;s Manufacturing Power with Africa&apos;s Growing Demand
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  SL Trade was founded with a clear mission: to provide
                  African manufacturers with reliable access to high-quality
                  plastic raw materials at competitive prices.
                </p>
                <p>
                  Based in Guangzhou, one of China&apos;s largest plastics trading
                  hubs, we have established direct partnerships with leading
                  petrochemical producers including Sinopec, PetroChina, and
                  CNOOC. This gives us access to a wide range of resins at
                  factory-direct prices.
                </p>
                <p>
                  What sets us apart is our unique combination of deep
                  industry knowledge and cutting-edge technology. Our team
                  uses AI-powered tools to monitor market prices, optimize
                  logistics, and provide real-time support to our customers
                  across multiple time zones and languages.
                </p>
              </div>
            </div>

            <div className="h-72 lg:h-96 bg-gradient-to-br from-surface to-surface-dark rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary/10">SL</div>
                <div className="text-sm text-gray-400 mt-2">
                  Guangzhou, China
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-white border border-gray-100"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-light">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-xl border border-gray-100 bg-white"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            Let&apos;s Build a Partnership
          </h2>
          <p className="mt-3 text-white/70 max-w-lg mx-auto">
            Whether you need a one-time shipment or ongoing supply, we&apos;re
            here to help your business grow.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center mt-6 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </>
  );
}
