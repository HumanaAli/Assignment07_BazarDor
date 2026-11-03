
export const instant = false;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const sort = query?.sort || "default";

  const allProducts = await getProducts();

  const categoryProducts = allProducts.filter(
    (product) => product.category === slug
  );

  if (categoryProducts.length === 0) {
    notFound();
  }

  const category = categoryProducts[0];

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sort === "low-to-high") {
      return Number(a.today) - Number(b.today);
    }

    if (sort === "high-to-low") {
      return Number(b.today) - Number(a.today);
    }

    return 0;
  });

  const sortLabels = {
    default: "ডিফল্ট",
    "low-to-high": "দাম: কম থেকে বেশি",
    "high-to-low": "দাম: বেশি থেকে কম",
  };

  return (
    <main className="min-h-screen bg-green-50">
      <header className="bg-green-700 px-6 py-5 text-white">
        <Link href="/" className="text-sm">
          ← হোম পেজ
        </Link>

        <h1 className="mt-3 text-3xl font-bold">
          {category.categoryIcon} {category.categoryNameBn}
        </h1>

        <p className="mt-2 text-sm">
          এই ক্যাটাগরির সকল পণ্য
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            মোট পণ্য: {sortedProducts.length}
          </h2>

          <details className="relative">
            <summary className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-800">
              সাজান: {sortLabels[sort] || "ডিফল্ট"} ▼
            </summary>

            <div className="absolute right-0 z-10 mt-2 w-52 rounded-lg bg-white p-2 shadow-lg">
              <Link
                href={`/category/${slug}`}
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-green-50"
              >
                ডিফল্ট
              </Link>

              <Link
                href={`/category/${slug}?sort=low-to-high`}
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-green-50"
              >
                দাম: কম থেকে বেশি
              </Link>

              <Link
                href={`/category/${slug}?sort=high-to-low`}
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-green-50"
              >
                দাম: বেশি থেকে কম
              </Link>
            </div>
          </details>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => {
            const change = parseFloat(product.change) || 0;

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="text-4xl">{product.image}</div>

                <h3 className="mt-3 font-semibold text-gray-900">
                  {product.nameBn}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  প্রতি {product.unit}
                </p>

                <p className="mt-2 font-bold text-green-700">
                  {Number(product.today).toLocaleString("bn-BD")} টাকা
                </p>

                <p
                  className={`mt-2 text-sm font-semibold ${
                    change > 0
                      ? "text-red-600"
                      : change < 0
                        ? "text-green-600"
                        : "text-gray-500"
                  }`}
                >
                  {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
                  {Math.abs(change).toLocaleString("bn-BD")}%
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
