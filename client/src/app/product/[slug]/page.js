
export const instant = false;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "তথ্য নেই";
  }

  return `${Number(price).toLocaleString("bn-BD")} টাকা`;
}

function getMarketPrice(market) {
  if (typeof market === "number") return market;

  if (!market || typeof market !== "object") return null;

  const entry = Object.entries(market).find(
    ([key, value]) =>
      /(today|price|current|দাম)/i.test(key) &&
      value !== "" &&
      Number.isFinite(Number(value))
  );

  return entry ? Number(entry[1]) : null;
}

export default async function ProductDetails({ params }) {
  const { slug } = await params;

  const products = await getProducts();

  const basicProduct = products.find(
    (item) => item.slug === slug
  );

  if (!basicProduct) {
    notFound();
  }

  let product = basicProduct;

  // Try to get the detailed product information from the API.
  try {
    const response = await fetch(
      `${API_URL}/products/${basicProduct.id}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      const result = await response.json();
      const details = result.data ?? result.product ?? result;

      if (details && !Array.isArray(details)) {
        product = { ...basicProduct, ...details };
      }
    }
  } catch (error) {
    console.error("Could not load detailed product data:", error);
  }

  const markets = Array.isArray(product.markets)
    ? product.markets
    : product.markets && typeof product.markets === "object"
      ? Object.values(product.markets)
      : [];

  const marketPrices = markets
    .map(getMarketPrice)
    .filter((price) => price !== null && price >= 0);

  const minimumPrice =
    product.minPrice ??
    product.minimumPrice ??
    (marketPrices.length ? Math.min(...marketPrices) : null);

  const maximumPrice =
    product.maxPrice ??
    product.maximumPrice ??
    (marketPrices.length ? Math.max(...marketPrices) : null);

  const averagePrice =
    product.avgPrice ??
    product.averagePrice ??
    (marketPrices.length
      ? marketPrices.reduce((sum, price) => sum + price, 0) /
        marketPrices.length
      : null);

  return (
    <main className="min-h-screen bg-green-50">
      <header className="bg-green-700 px-6 py-5 text-white">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm hover:underline">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* Product Summary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-green-50 text-6xl">
              {product.image}
            </div>

            <div>
              <p className="text-sm font-medium text-green-700">
                {product.categoryNameBn || product.category}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {product.nameBn}
              </h1>

              <p className="mt-2 text-gray-600">
                {product.description ||
                  "বিভিন্ন বাজারের আজকের পণ্যের দাম এক জায়গায় দেখুন।"}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                একক: {product.unit}
              </p>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          মূল্যের সারসংক্ষেপ
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-600">সর্বনিম্ন দাম</p>
            <p className="mt-3 text-2xl font-bold text-green-700">
              {formatPrice(minimumPrice)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-600">সর্বোচ্চ দাম</p>
            <p className="mt-3 text-2xl font-bold text-red-600">
              {formatPrice(maximumPrice)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-600">গড় দাম</p>
            <p className="mt-3 text-2xl font-bold text-blue-700">
              {formatPrice(averagePrice)}
            </p>
          </div>
        </div>

        {/* Market Prices */}
        <h2 className="mt-12 text-2xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length > 0 ? (
          <div className="mt-5 overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-green-100 text-gray-800">
                <tr>
                  <th className="p-4">বাজার</th>
                  <th className="p-4">বাজারের তথ্য</th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => {
                  const marketName =
                    market?.marketNameBn ||
                    market?.marketName ||
                    market?.bazarName ||
                    market?.nameBn ||
                    market?.name ||
                    `বাজার ${index + 1}`;

                  return (
                    <tr
                      key={index}
                      className="border-t border-gray-100"
                    >
                      <td className="p-4 font-semibold text-gray-900">
                        {marketName}
                      </td>

                      <td className="p-4 text-gray-700">
                        {typeof market === "object" && market !== null
                          ? Object.entries(market)
                              .filter(
                                ([key]) =>
                                  ![
                                    "marketNameBn",
                                    "marketName",
                                    "bazarName",
                                    "nameBn",
                                    "name",
                                  ].includes(key)
                              )
                              .map(([key, value]) => (
                                <span key={key} className="mr-4 inline-block">
                                  {key}:{" "}
                                  {value !== null &&
                                  typeof value === "object"
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </span>
                              ))
                          : String(market)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-white p-6 text-gray-600">
            এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    </main>
  );
}
