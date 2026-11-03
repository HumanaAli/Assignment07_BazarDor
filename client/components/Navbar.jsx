
import Link from "next/link";
import { connection } from "next/server";
import { getProducts } from "@/lib/products";

export default async function Navbar() {
  const products = await getProducts();

  const categories = Array.from(
    new Map(
      products.map((product) => [
        product.category,
        {
          slug: product.category,
          name: product.categoryNameBn,
          icon: product.categoryIcon,
        },
      ])
    ).values()
  );

  // Generate the current date when a visitor opens the page.
  await connection();

  const today = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
        <Link href="/" className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-green-700">
            🛒 বাজার দর
          </h1>
          <p className="text-sm text-gray-600">{today}</p>
        </Link>

        <div className="flex gap-3">
          <Link
            href="/signin"
            className="rounded-lg border border-green-700 px-4 py-2 font-medium text-green-700"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-green-700 px-4 py-2 font-medium text-white"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      <nav className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-6 py-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap font-medium text-gray-700 hover:text-green-700"
            >
              {category.icon} {category.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="overflow-x-auto border-t border-amber-200 bg-amber-50">
        <div className="flex w-max gap-8 px-6 py-3">
          {products.map((product) => {
            const change = Number(
              String(product.change ?? 0)
                .replace("%", "")
                .replace("+", "")
            );

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="whitespace-nowrap text-sm"
              >
                <span>{product.image}</span>{" "}
                <span className="font-medium text-gray-800">
                  {product.nameBn}
                </span>{" "}
                <span className="text-gray-700">
                  ৳{Number(product.today).toLocaleString("bn-BD")} / {product.unit}
                </span>{" "}
                <span
                  className={
                    change > 0
                      ? "font-semibold text-red-600"
                      : change < 0
                        ? "font-semibold text-green-600"
                        : "font-semibold text-gray-500"
                  }
                >
                  {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
                  {Math.abs(change).toLocaleString("bn-BD")}%
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
