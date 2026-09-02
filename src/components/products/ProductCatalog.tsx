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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  // Filter produk berdasarkan kategori yang dipilih.
  const filteredProducts =
    selectedCategory === null
      ? products
      : products.filter(
          (product) => product.category_id === selectedCategory
        );

  return (
    <div>
      {/* Tombol filter kategori */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-4 py-2 text-sm transition ${
            selectedCategory === null
              ? "bg-[#003f52] text-white hover:-translate-y-0.5 hover:bg-[#00566d] hover:shadow-md"
              : "border border-[#d4af37]/50 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#fffaf0] hover:shadow-md"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedCategory === category.id
                ? "bg-[#003f52] text-white hover:-translate-y-0.5 hover:bg-[#00566d] hover:shadow-md"
                : "border border-[#d4af37]/50 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#fffaf0] hover:shadow-md"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product list */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">
          Tidak ada produk pada kategori ini.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
