"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import ProductCard from "./ProductCard";

type ProductCatalogProps = {
  products: Product[];
  categories: Category[];
};

export default function ProductCatalog({
  products,
  categories,
}: ProductCatalogProps) {
  // Menyimpan kategori yang sedang dipilih.
  // null berarti menampilkan semua produk.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter produk berdasarkan kategori yang dipilih.
  const filteredProducts =
    selectedCategory === null
      ? products
      : products.filter((product) => product.category_id === selectedCategory);

  return (
    <div>
      {/* Tombol filter kategori */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
            selectedCategory === null
              ? "bg-[#003f52] text-white shadow-md shadow-[#003f52]/20"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#d4af37] hover:bg-[#fffaf0] hover:text-[#003f52]"
          }`}
        >
          Semua ({products.length})
        </button>

        {categories.map((category) => {
          const count = products.filter((p) => p.category_id === category.id).length;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                selectedCategory === category.id
                  ? "bg-[#003f52] text-white shadow-md shadow-[#003f52]/20"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#d4af37] hover:bg-[#fffaf0] hover:text-[#003f52]"
              }`}
            >
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Product list */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#d4af37]/40 bg-white/70 p-12 text-center">
          <span className="text-4xl">🌸</span>
          <h4 className="mt-3 text-base font-bold text-[#003f52]">
            Belum ada produk di kategori ini
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Silakan pilih kategori lain atau lihat seluruh koleksi bouquet kami.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className="mt-4 inline-block rounded-xl bg-[#003f52] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#00526b]"
          >
            Lihat Semua Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
