
export const instant = false;

import { getProducts, getCategories } from "@/lib/products";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-green-50">
      <header className="bg-green-700 px-6 py-4 text-white">
        <h1 className="text-2xl font-bold">Bazar Dor</h1>
        <p className="text-sm">Your everyday grocery marketplace</p>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900">
          Fresh groceries, fair prices
        </h2>
        <p className="mt-3 text-gray-600">
          Find the everyday essentials you need in one place.
        </p>

        <h3 className="mt-10 text-xl font-semibold text-gray-900">
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

        <h3 className="mt-12 text-xl font-semibold text-gray-900">
          Popular products
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="text-3xl">{product.image}</div>

              <h4 className="mt-2 font-semibold text-gray-900">
                {product.nameBn}
              </h4>

              <p className="mt-2 text-green-700">
                ৳{product.today} / {product.unit}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
