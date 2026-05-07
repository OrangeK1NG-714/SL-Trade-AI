import Link from "next/link";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="h-48 bg-gradient-to-br from-surface to-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors">
            {product.category.toUpperCase()}
          </div>
          <div className="text-sm text-gray-400 mt-1">{product.name}</div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="inline-flex self-start px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-primary-light/10 text-primary-light mb-3">
          {product.category}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-light transition-colors">
          {product.name}
        </h3>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.applications.slice(0, 3).map((app) => (
            <span
              key={app}
              className="px-2 py-0.5 text-[10px] rounded-full bg-gray-50 text-gray-500 border border-gray-100"
            >
              {app}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">View details</span>
          <svg
            className="w-4 h-4 text-gray-300 group-hover:text-primary-light group-hover:translate-x-1 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
