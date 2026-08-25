import ProductCatalog from "../../components/products/ProductCatalog";
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

export default async function ProductsPage() {
  // Mengambil products dan categories dari Supabase secara bersamaan.
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Our Products
        </h1>

        <p className="mt-2 text-gray-600">
          Pilih bouquet yang cocok untuk kamu.
        </p>
      </div>

      <ProductCatalog
        products={products}
        categories={categories}
      />
    </main>
  );
}