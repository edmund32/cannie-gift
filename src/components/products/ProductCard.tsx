import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d4af37] hover:shadow-lg">
      {/* Gambar produk */}
      <Image
        src={product.image_url}
        alt={product.name}
        width={640}
        height={480}
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
      />

      {/* Informasi produk */}
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {product.name}
        </h2>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
            {product.description}
          </p>
        )}

        <p className="mt-4 text-lg font-bold text-[#003f52]">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <Link
          href={`/products/${product.id}`}
          className="mt-4 block w-full rounded-lg bg-[#003f52] px-4 py-2.5 text-center text-white transition hover:bg-[#00566d]"
        >
          Lihat Produk
        </Link>
      </div>
    </article>
  );
}
