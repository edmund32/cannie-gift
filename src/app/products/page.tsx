import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/services/productService";

export default async function ProductsPage() {
  const products = await getProducts();

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

      {products.length === 0 ? (
        <p className="text-gray-500">
          Belum ada produk yang tersedia.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}