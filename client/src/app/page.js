
export const instant = false;

import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { getProducts, getCategories } from "@/lib/products";

function ProductCard({ product }) {
  const today = Number(product.today);
  const yesterday = Number(product.yesterday);
  const difference = today - yesterday;

  const percentage =
    yesterday > 0
      ? ((difference / yesterday) * 100).toFixed(1)
      : "0.0";

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm">
      <div className="text-3xl">{product.image}</div>

      <h4 className="mt-3 font-semibold text-gray-900">
        {product.nameBn}
      </h4>

      <p className="mt-2 text-green-700">
        ৳{today} / {product.unit}
      </p>

      <p
        className={`mt-2 font-semibold ${
          difference > 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        {difference > 0 ? "▲" : "▼"} ৳
        {Math.abs(difference)} ({Math.abs(Number(percentage))}%)
      </p>
    </article>
  );
}

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const priceIncreased = products.filter(
    (product) => Number(product.today) > Number(product.yesterday)
  );

  const priceDecreased = products.filter(
    (product) => Number(product.today) < Number(product.yesterday)
  );

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-2">
        <div>
          <p className="font-semibold text-green-700">
            Welcome to Bazar Dor
          </p>

          <h2 className="mt-3 text-4xl font-bold leading-tight text-gray-900">
            Fresh groceries, fair prices.
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Know today's market prices and shop smarter with Bazar Dor.
          </p>

          <Link
            href="#products"
            className="mt-7 inline-block rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            Explore Products
          </Link>
        </div>

        <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-80">
          <Image
            src="/bazar-hero.png"
            alt="Fresh groceries"
            fill
            priority
            className="object-contain"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h3 className="text-xl font-semibold text-gray-900">
          Shop by category
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-xl bg-white p-6 text-center font-semibold text-gray-900 shadow-sm"
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Price Increased */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h3 className="text-2xl font-bold text-red-600">
          Prices Increased
        </h3>

        <p className="mt-2 text-gray-600">
          Products that are more expensive than yesterday.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {priceIncreased.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {priceIncreased.length === 0 && (
          <p className="mt-4 text-gray-600">
            No price increases found.
          </p>
        )}
      </section>

      {/* Price Decreased */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h3 className="text-2xl font-bold text-green-700">
          Prices Decreased
        </h3>

        <p className="mt-2 text-gray-600">
          Products that are cheaper than yesterday.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {priceDecreased.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {priceDecreased.length === 0 && (
          <p className="mt-4 text-gray-600">
            No price decreases found.
          </p>
        )}
      </section>

      {/* All Products */}
      <section
        id="products"
        className="mx-auto max-w-6xl px-6 py-10"
      >
        <h3 className="text-2xl font-bold text-gray-900">
          All Products
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
