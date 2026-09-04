import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getProducts } from "../../services/productService";

export default async function ProductsPage() {
  // Produk diambil saat request agar build tidak bergantung pada
  // koneksi Supabase yang tersedia pada saat proses build.
  await connection();

  const products = await getProducts();

  // Ambil 3 produk unggulan: Velvet Passion, Celestial Blue, dan Sunny Scholar
  const targetSignatureNames = ["velvet passion", "celestial blue", "sunny scholar"];
  const matchedSignatureProducts = targetSignatureNames
    .map((target) => products.find((p) => p.name.toLowerCase().includes(target)))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  const signatureProducts =
    matchedSignatureProducts.length > 0
      ? matchedSignatureProducts
      : products.slice(0, 3);

  return (
    <>
      <main className="min-h-screen bg-[#fffaf0] pb-20">
      {/* 1. HERO SECTION (Inspired by 'Flowers From the Heart' Hero in image.png) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fffaf0] via-white to-[#fffaf0] px-4 pt-8 pb-16 sm:px-6 sm:pt-14 sm:pb-24 lg:px-8">
        {/* Background Decorative Watermark */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden opacity-5">
          <span className="text-[140px] font-black uppercase tracking-[0.2em] text-[#003f52] sm:text-[220px]">
            FLOWERS
          </span>
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
          {/* Kolom Kiri: Headline, rating, CTA */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7b12]">
                ✦ Flowers From the Heart ✦
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#003f52] sm:text-5xl lg:text-6xl">
              Rangkai Cinta, Satukan Rasa.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Hasil kreasi rangkaian bunga istimewa yang dibuat dengan sepenuh hati dan ketulusan, siap hadir menyempurnakan kebahagiaan di setiap momen berhargamu bersama orang tersayang.
            </p>

            {/* Social Proof / Trust Indicator */}
            <div className="mt-6 flex items-center justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white/80 px-4 py-1.5 text-xs text-gray-700 shadow-xs backdrop-blur-xs sm:text-sm">
                <span className="text-xs font-bold text-[#9b7b12]">✦</span>
                <span>
                  Telah dipercaya menemani <strong className="font-bold text-[#003f52]">1.000+ momen bahagia</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-[#003f52] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#003f52]/25 transition hover:bg-[#00526b] hover:shadow-xl"
              >
                <span>Jelajahi Bouquet Sekarang</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Featured Showcase Card */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#d4af37]/35 bg-white p-6 shadow-2xl shadow-[#003f52]/10">
              <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#d4af37]/15 blur-2xl" />
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#fffaf0] to-white p-4">
                <Image
                  src="/Cannie.png"
                  alt="Moments with Cannie"
                  width={380}
                  height={380}
                  className="h-full w-full object-contain drop-shadow-md transition duration-500 hover:scale-105"
                  priority
                />
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="font-bold text-[#003f52]">Moments with Cannie</h3>
                <p className="text-xs text-gray-500">Koleksi Terpopuler Momen Spesial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BAR (Inspired by 5 badges bar in image.png) */}
      <section className="border-y border-[#d4af37]/25 bg-white py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
          <div className="flex items-center gap-3 p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fffaf0] text-[#003f52]">
              🌸
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Fresh & Artificial</h4>
              <p className="text-[11px] text-gray-500">Bunga segar & awet premium</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fffaf0] text-[#003f52]">
              🚚
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Same-Day Delivery</h4>
              <p className="text-[11px] text-gray-500">Kirim cepat & terjadwal aman</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fffaf0] text-[#003f52]">
              ✂️
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Trusted Florist</h4>
              <p className="text-[11px] text-gray-500">100% dirangkai manual rapi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fffaf0] text-[#003f52]">
              🎀
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Semua Momen</h4>
              <p className="text-[11px] text-gray-500">Wisuda, ultah, & perayaan</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-center gap-3 p-2 sm:col-span-1 sm:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fffaf0] text-[#003f52]">
              🎁
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Kemasan Elegan</h4>
              <p className="text-[11px] text-gray-500">Free kartu ucapan custom</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHT QUICK PREVIEW: OUR SIGNATURE AND BEST SELLER BOUQUET */}
      {signatureProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b7b12]">
              ✦ Koleksi Favorit Cannie Gift ✦
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#003f52] sm:text-3xl">
              Our Signature and Best Seller Bouquet
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
              Sentuhan estetika manis yang siap menghangatkan senyum orang tersayangmu.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            {signatureProducts.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group flex flex-col items-center rounded-2xl border border-gray-200/80 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#d4af37] hover:shadow-md"
              >
                <div className="relative aspect-square w-28 overflow-hidden rounded-full border-2 border-[#d4af37]/30 bg-[#fffaf0] p-1 sm:w-32">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={130}
                    height={130}
                    className="h-full w-full rounded-full object-cover transition duration-300 group-hover:scale-110"
                  />
                </div>
                <h4 className="mt-4 line-clamp-1 text-sm font-bold text-gray-900 group-hover:text-[#003f52]">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs font-semibold text-[#003f52] sm:text-sm">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </Link>
            ))}
          </div>

          {/* Tombol Menuju Halaman Katalog Lengkap */}
          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#003f52] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#003f52]/20 transition duration-300 hover:bg-[#00526b] hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Katalog Lengkap Bouquet</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE US (Inspired by 'Why Choose Us' 4-quadrant section in image.png) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b7b12]">
            ✦ Mengapa Memilih Cannie Gift? ✦
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#003f52] sm:text-3xl">
            Kualitas & Dedikasi di Setiap Rangkaian
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
            Kami memastikan setiap bunga tiba dalam kondisi terbaik, dikemas dengan hati-hati dan penuh ketelitian.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:border-[#d4af37]">
            <span className="text-2xl font-extrabold text-[#d4af37]">01</span>
            <h4 className="mt-2 text-base font-bold text-gray-900">Bunga Berkualitas Tinggi</h4>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Setiap tangkai bunga segar dipilih langsung di hari pembuatan, dan bahan bunga artificial dirancang mirip aslinya.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:border-[#d4af37]">
            <span className="text-2xl font-extrabold text-[#d4af37]">02</span>
            <h4 className="mt-2 text-base font-bold text-gray-900">100% Handcrafted</h4>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Dirangkai oleh tangan kreatif florist dengan memperhatikan perpaduan warna dan estetika wrapping yang proporsional.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:border-[#d4af37]">
            <span className="text-2xl font-extrabold text-[#d4af37]">03</span>
            <h4 className="mt-2 text-base font-bold text-gray-900">Pengemasan Terlindungi</h4>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Menggunakan packaging kokoh agar bentuk bouquet tetap mengembang dan aman selama perjalanan pengiriman.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:border-[#d4af37]">
            <span className="text-2xl font-extrabold text-[#d4af37]">04</span>
            <h4 className="mt-2 text-base font-bold text-gray-900">Garansi Kepuasan</h4>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Layanan responsif dan ramah untuk memastikan pengalaman berbelanja hadiahmu berjalan menyenangkan.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIAL SECTION (Inspired by 'What Our Clients Say' in image.png) */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-[#d4af37]/30 bg-gradient-to-b from-white to-[#fffaf0] p-8 text-center shadow-lg sm:p-12">
          <span className="text-4xl text-[#d4af37]">“</span>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-700 italic sm:text-base">
            Bouquet bunganya cantik sekali dan sesuai dengan ekspektasi! Pengirimannya tepat waktu untuk acara wisuda adik saya,
            wrapping-nya sangat rapi dan kartu ucapannya ditulis dengan manis. Pasti akan pesan lagi di Cannie Gift!
          </p>

          <div className="mt-6 flex justify-center text-[#d4af37]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <div className="mt-3">
            <h5 className="text-sm font-bold text-[#003f52]">Clarissa Putri</h5>
            <p className="text-xs text-gray-500">Pelanggan Setia Cannie Gift</p>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CONSULTATION / CUSTOM CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#003f52] p-8 text-center text-white sm:flex-row sm:text-left sm:p-10">
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">Butuh Rangkaian Bouquet Kustom?</h3>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">
              Kamu bisa request kombinasi warna pembungkus, jenis bunga, dan budget yang sesuai kebutuhanmu.
            </p>
          </div>

          <Link
            href="/catalog"
            className="shrink-0 rounded-xl bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#003f52] transition hover:bg-[#e3c354]"
          >
            Pilih Bouquet Favorit
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
  );
}
