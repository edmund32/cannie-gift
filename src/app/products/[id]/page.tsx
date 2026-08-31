import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "../../../services/productService";
import AddToCartButton from "../../../components/products/AddToCartButton";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  // Mengambil ID produk dari URL.
  const { id } = await params;

  // Mencari produk berdasarkan ID tersebut di Supabase.
  const product = await getProductById(id);

  // Kalau ID tidak ditemukan di database,
  // tampilkan halaman 404.
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Tombol kembali ke katalog */}
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-gray-600 hover:text-black"
      >
        ← Kembali ke Produk
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Gambar produk */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full max-h-[500px] w-full object-cover"
          />
        </div>

        {/* Informasi produk */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-4 text-gray-600">
              {product.description}
            </p>
          )}

          <p className="mt-6 text-2xl font-bold">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </main>
  );
}