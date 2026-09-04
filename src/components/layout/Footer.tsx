import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Jl. Esumawijaya, Gg. Pananjung Kp. Sindang Barang, Pasireurih, Kec. Tamansari, Kabupaten Bogor, Jawa Barat 16611"
  )}`;

  return (
    <footer className="mt-auto border-t border-[#d4af37]/30 bg-[#002f3e] text-white">
      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Kolom 1: Brand & Tagline (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/products" className="group inline-flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#d4af37] bg-white p-0.5 shadow-md transition group-hover:scale-105">
                <Image
                  src="/Cannie.png"
                  alt="Cannie Gift"
                  fill
                  sizes="48px"
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white transition group-hover:text-[#d4af37]">
                  Cannie Gift
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                  Florist & Boutique
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs italic text-[#d4af37]">
              &ldquo;Rangkai Cinta, Satukan Rasa.&rdquo;
            </p>

            <p className="mt-3 text-xs leading-relaxed text-white/75">
              Menghadirkan kreasi bouquet bunga segar, artificial, snack, dan kado manis istimewa yang dirangkai manual dengan sepenuh hati untuk menyempurnakan setiap momen bahagiamu.
            </p>

            {/* Social Media Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.instagram.com/cannie.gift"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#d4af37] hover:bg-white/20 hover:text-[#d4af37]"
                title="Instagram @cannie.gift"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>@cannie.gift</span>
              </a>

              <a
                href="https://www.tiktok.com/@cannie.gift"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#d4af37] hover:bg-white/20 hover:text-[#d4af37]"
                title="TikTok cannie.gift"
              >
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <span>cannie.gift</span>
              </a>
            </div>
          </div>

          {/* Kolom 2: Kontak WhatsApp & Konsultasi (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Hubungi Kami
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-white/75">
              Punya pertanyaan, request custom buket bunga, atau butuh konsultasi cepat? Hubungi kami via WhatsApp:
            </p>

            <div className="mt-4">
              <a
                href="https://api.whatsapp.com/send?phone=628999331910&text=Halo%20Cannie%20Gift,%20saya%20ingin%20tanya%20seputar%20bouquet%20bunga"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 transition hover:border-emerald-400 hover:bg-emerald-900/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition group-hover:scale-105">
                  <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-emerald-300">
                    WhatsApp Chat
                  </span>
                  <span className="text-sm font-bold text-white group-hover:text-emerald-200">
                    +62 899-9331-910
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Kolom 3: Alamat Workshop (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Alamat Workshop & Toko
            </h4>
            <div className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-white/80">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-white/90">
                  Jl. Esumawijaya, Gg. Pananjung Kp. Sindang Barang, Pasireurih, Kec. Tamansari, Kabupaten Bogor, Jawa Barat 16611
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#d4af37] transition hover:text-white hover:underline"
                >
                  <span>Buka di Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 4: Navigasi Cepat (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
              Navigasi
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-white/75">
              <li>
                <Link href="/products" className="transition hover:text-[#d4af37]">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="transition hover:text-[#d4af37]">
                  Katalog Bouquet
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-[#d4af37]">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-[#d4af37]">
                  Login Akun
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs text-white/60 sm:flex-row sm:text-left">
          <p>© {currentYear} Cannie Gift. All rights reserved.</p>
          <p className="text-white/50">
            Dibuat dengan sepenuh hati untuk setiap momen bahagiamu 💐
          </p>
        </div>
      </div>
    </footer>
  );
}

