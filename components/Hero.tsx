import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Trusted Supplier Since 2024
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Premium Plastic
            <br />
            Raw Materials for
            <br />
            <span className="text-accent">African Markets</span>
          </h1>

          <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
            We supply high-quality PP, PE, PVC, ABS, PET and PS resins to
            manufacturers across Africa. Competitive pricing, reliable
            logistics, and dedicated 24/7 support.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors text-sm"
            >
              View Products
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors text-sm border border-white/20"
            >
              Request a Quote
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-white">50+</div>
              <div className="text-xs text-white/50 mt-1">Products</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-white">20+</div>
              <div className="text-xs text-white/50 mt-1">Countries</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-white">24/7</div>
              <div className="text-xs text-white/50 mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
