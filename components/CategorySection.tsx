import Link from "next/link";
import { categories } from "@/data/products";

export default function CategorySection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Product Range</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            We offer a comprehensive range of plastic raw materials to meet
            diverse manufacturing needs across Africa.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group flex flex-col items-center p-6 rounded-xl border border-gray-100 hover:border-primary-light/30 hover:shadow-lg transition-all bg-white"
            >
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="text-lg font-bold text-gray-900 group-hover:text-primary-light transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400 mt-1 text-center">
                {cat.fullName}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
