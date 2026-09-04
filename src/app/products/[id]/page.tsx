import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return { title: "Produk Tidak Ditemukan | Cannie Gift" };
  }
  return {
    title: `${product.name} — Cannie Gift`,
    description:
      product.description ||
      `Pesan ${product.name} eksklusif di Cannie Gift. Rangkaian bouquet bunga segar, artificial, dan snack berkualitas tinggi.`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  await connection();

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Ambil kategori dan produk lainnya untuk rekomendasi
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const currentCategory = categories.find((c) => c.id === product.category_id);
  const isFreshFlower = Boolean(
    currentCategory?.name.toLowerCase().includes("fresh")
  );
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const whatsappMessage = encodeURIComponent(
    `Halo Cannie Gift, saya tertarik dan ingin bertanya mengenai bouquet "${product.name}" (Rp ${product.price.toLocaleString("id-ID")}). Apakah masih bisa dipesan?`
  );

  return (
    <main className="min-h-screen bg-[#fffaf0] pb-24 text-gray-800">
      {/* 1. TOP BREADCRUMB & BACK NAV */}
      <section className="border-b border-[#d4af37]/20 bg-white/70 px-4 py-4 backdrop-blur-xs sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-gray-500">
            <Link href="/products" className="transition hover:text-[#003f52]">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/catalog" className="transition hover:text-[#003f52]">
              Katalog Bouquet
            </Link>
            {currentCategory && (
              <>
                <span>/</span>
                <span className="text-gray-600">{currentCategory.name}</span>
              </>
            )}
            <span>/</span>
            <span className="font-semibold text-[#003f52] truncate max-w-[180px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 font-semibold text-[#003f52] transition hover:text-[#d4af37]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </section>

      {/* 2. MAIN PRODUCT DETAIL SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Kolom Kiri: Visual Showcase Image */}
          <div className="lg:col-span-6">
            <div className="sticky top-24">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#d4af37]/35 bg-white p-5 shadow-xl shadow-[#003f52]/5">
                {/* Glow Background Aksesori */}
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#003f52]/5 blur-3xl pointer-events-none" />

                {/* Floating Badge */}
                <div className="absolute top-8 left-8 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#003f52] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                    ★ 100% Handcrafted
                  </span>
                </div>

                {/* Foto Bouquet */}
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#fffaf0] to-white p-2">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={700}
                    height={700}
                    priority
                    className="h-full w-full object-contain drop-shadow-lg transition duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Informasi Produk, Harga & Aksi Beli */}
          <div className="flex flex-col lg:col-span-6">
            {/* Kategori Badge */}
            <div className="flex items-center">
              <span className="rounded-full border border-[#d4af37]/40 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9b7b12]">
                ✦ {currentCategory?.name || "Boutique Collection"} ✦
              </span>
            </div>

            {/* Judul Produk */}
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#003f52] sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Harga Produk */}
            <div className="mt-4 rounded-2xl border border-[#d4af37]/30 bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Harga Resmi
              </span>
              <div className="mt-1">
                <span className="text-3xl font-black text-[#003f52] sm:text-4xl">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Deskripsi Produk */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Deskripsi Rangkaian
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                {product.description ||
                  "Rangkaian bouquet istimewa yang dibuat dengan tangan terampil florist berpengalaman. Memadukan keindahan komposisi warna bunga segar, ornamen aksen pelengkap, serta kemasan kertas wrapping berkualitas tinggi yang siap mewakili perasaan bahagiamu."}
              </p>
            </div>

            {/* Rincian Jaminan & Keunggulan Buket */}
            <div className="mt-6 space-y-3 rounded-2xl border border-gray-200/80 bg-white/70 p-4 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#003f52]/10 text-[#003f52] font-bold">✓</span>
                <span><strong className="text-gray-900">100% Handcrafted:</strong> Dirangkai manual dengan penuh ketelitian oleh florist profesional</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#003f52]/10 text-[#003f52] font-bold">✓</span>
                <span><strong className="text-gray-900">Garansi Kualitas:</strong> Rangkaian dijamin tetap bagus, segar, dan rapi sampai ke tangan customer</span>
              </div>
            </div>

            {/* Tombol Aksi Pembelian & WhatsApp */}
            <div className="mt-8 space-y-4">
              {/* Tambah ke Keranjang */}
              <AddToCartButton productId={product.id} variant="full" />

              {/* Chat WhatsApp / Konsultasi Custom */}
              <div className="flex flex-col gap-3 rounded-2xl border border-emerald-600/20 bg-emerald-50/50 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                    <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950 sm:text-sm">
                      Ingin Request Khusus?
                    </h5>
                    <p className="text-[11px] text-emerald-700">
                      Bisa custom warna wrapping, pita, atau konsultasi bunga
                    </p>
                  </div>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?phone=628999331910&text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                >
                  <span>Chat WhatsApp</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FLOWER CARE & DETAILS SECTION */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-6 ${
            isFreshFlower ? "md:grid-cols-3" : "mx-auto max-w-4xl md:grid-cols-2"
          }`}
        >
          {isFreshFlower && (
            <div className="rounded-3xl border border-[#d4af37]/25 bg-white p-6 shadow-sm">
              <span className="text-2xl">🌸</span>
              <h4 className="mt-3 text-base font-bold text-[#003f52]">Fresh & Premium</h4>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Kualitas bunga segar pilihan terbaik yang dipetik dan dirangkai teliti oleh florist berpengalaman untuk memastikan keindahan, kesegaran alami, dan estetika bouquet selalu terjamin.
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-[#d4af37]/25 bg-white p-6 shadow-sm">
            <span className="text-2xl">🚚</span>
            <h4 className="mt-3 text-base font-bold text-[#003f52]">Kirim Cepat</h4>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Layanan same-day delivery dan pengiriman terjadwal dengan kemasan kardus pelindung khusus agar kertas wrapping tidak terlipat dan susunan bouquet tetap rapi hingga ke tangan penerima.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d4af37]/25 bg-white p-6 shadow-sm">
            <span className="text-2xl">💌</span>
            <h4 className="mt-3 text-base font-bold text-[#003f52]">Free Kartu Ucapan</h4>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Custom pesanmu secara bebas. Setiap pemesanan sudah termasuk kartu ucapan estetik Cannie Gift secara gratis untuk menyampaikan doa dan kata-kata manis terbaikmu.
            </p>
          </div>
        </div>
      </section>

      {/* 4. REKOMENDASI BOUQUET LAINNYA */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7b12]">
                ✦ Rekomendasi Pilihan ✦
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#003f52] sm:text-3xl">
                Bouquet Lainnya yang Mungkin Kamu Suka
              </h2>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003f52] hover:text-[#d4af37] transition"
            >
              <span>Lihat Semua Katalog</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
