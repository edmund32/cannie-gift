import { connection } from "next/server";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import ProductCatalog from "@/components/products/ProductCatalog";
import { getCategories } from "@/services/categoryService";
import { getProducts } from "@/services/productService";

export const metadata = {
  title: "Katalog Lengkap Bouquet | Cannie Gift",
  description:
    "Jelajahi seluruh koleksi bouquet bunga segar, artificial, dan snack pilihan terbaik dari Cannie Gift.",
};

export default async function CatalogPage() {
  await connection();

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      <main className="min-h-screen bg-[#fffaf0] pb-24">
        {/* Header Banner */}
        <section className="relative overflow-hidden border-b border-[#d4af37]/20 bg-gradient-to-b from-white via-[#fffaf0] to-[#fffaf0] px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500">
              <Link href="/products" className="transition hover:text-[#003f52]">
                Beranda
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#003f52]">Katalog Bouquet</span>
            </nav>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7b12]">
                  ✦ Our Complete Collection ✦
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#003f52] sm:text-4xl lg:text-5xl">
                Katalog Lengkap Bouquet
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Temukan seluruh rangkaian bouquet bunga segar, artificial, snack, dan hampers pilihan terbaik dari Cannie Gift yang dirangkai dengan cinta untuk setiap momen istimewamu.
              </p>
            </div>
          </div>
        </section>

        {/* Main Catalog Content */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <ProductCatalog products={products} categories={categories} />
        </section>
      </main>
      <Footer />
    </>
  );
}

