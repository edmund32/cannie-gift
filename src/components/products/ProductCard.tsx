import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d4af37] hover:shadow-xl">
      <div>
        {/* Gambar produk */}
        <Link
          href={`/products/${product.id}`}
          className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#fffaf0]/80"
        >
          <Image
            src={product.image_url}
            alt={product.name}
            width={640}
            height={480}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Informasi produk */}
        <div className="mt-4">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-base font-bold text-gray-900 transition group-hover:text-[#003f52]">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
              {product.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3.5">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]">
            Harga
          </span>
          <p className="text-base font-bold text-[#003f52]">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.id}`}
            className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#003f52] hover:bg-gray-50"
          >
            Detail
          </Link>
          <AddToCartButton productId={product.id} variant="icon" />
        </div>
      </div>
    </article>
  );
}
