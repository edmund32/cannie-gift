import { connection } from "next/server";
import ProductCatalog from "../../components/products/ProductCatalog";
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

export default async function ProductsPage() {
  // Produk dan kategori diambil saat request agar build tidak bergantung pada
  // koneksi Supabase yang tersedia pada saat proses build.
  await connection();

  // Mengambil products dan categories dari Supabase secara bersamaan.
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-[#fffaf0]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <section className="mb-12 rounded-3xl bg-[#003f52] px-6 py-10 text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            Hadiah penuh makna
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Temukan hadiah manis untuk orang tersayang.
          </h1>
          <p className="mt-4 max-w-xl text-white/75">
            Pilih bouquet pilihan kami untuk membuat momen spesial terasa lebih
            berkesan.
          </p>
        </section>

        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#9b7b12]">Koleksi kami</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Pilihan bouquet
            </h2>
          </div>
          <p className="hidden text-sm text-gray-500 sm:block">
            Dibuat dengan penuh perhatian
          </p>
        </div>

        <ProductCatalog
          products={products}
          categories={categories}
        />
      </div>
    </main>
  );
}
