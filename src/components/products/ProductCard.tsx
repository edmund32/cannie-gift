import type { Product } from "@/types/product";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Gambar produk */}
      <img
        src={product.image_url}
        alt={product.name}
        className="h-64 w-full object-cover"
      />

      {/* Informasi produk */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">
          {product.name}
        </h2>

        {product.description && (
          <p className="mt-2 text-sm text-gray-600">
            {product.description}
          </p>
        )}

        <p className="mt-4 text-lg font-bold">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <Link
          href={`/products/${product.id}`}
          className="mt-4 block w-full rounded-lg bg-black px-4 py-2 text-center text-white transition hover:opacity-80"
        >
          Lihat Produk
        </Link>
      </div>
    </article>
  );
}