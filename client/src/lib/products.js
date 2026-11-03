const API_URL = "https://openapi.programming-hero.com/api/bazardor";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Could not fetch products");
  }

  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.products)) return result.products;
  if (Array.isArray(result)) return result;

  return [];
}

export async function getCategories() {
  const products = await getProducts();

  return [...new Set(products.map((product) => product.category))];
}