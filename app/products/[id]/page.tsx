import { products } from "@/data/products";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-primary-light py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white">
              Products
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            {product.name}
          </h1>
          <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium uppercase tracking-wide">
            {product.category}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-64 lg:h-80 bg-gradient-to-br from-surface to-surface-dark rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary/20">
                    {product.category.toUpperCase()}
                  </div>
                  <div className="text-lg text-gray-400 mt-2">
                    {product.name}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Technical Specifications
                </h2>
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <table className="w-full">
                    <tbody>
                      {product.specs.map((spec, i) => (
                        <tr
                          key={spec.label}
                          className={i % 2 === 0 ? "bg-surface" : "bg-white"}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3">
                            {spec.label}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Applications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app) => (
                    <span
                      key={app}
                      className="px-3 py-1.5 text-sm rounded-lg bg-primary-light/5 text-primary-light border border-primary-light/10"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Packaging
                </h2>
                <p className="text-gray-600">{product.packaging}</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Interested in {product.name}?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Contact us for pricing, minimum order quantities, and
                  delivery options to your location.
                </p>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="block w-full text-center px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Request a Quote
                </Link>
                <a
                  href="https://wa.me/8613800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center mt-3 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Chat on WhatsApp
                </a>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quality certified
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    FOB & CIF pricing
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sample available
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Fast delivery to Africa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
