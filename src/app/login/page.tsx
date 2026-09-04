"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getOrCreateCustomerProfile } from "../../services/customerService";
import { mergeGuestCart } from "../../services/cartService";
import { clearGuestCart, getGuestCart } from "../../services/guestCartService";
import { useToast } from "@/components/ui/ToastProvider";

function subscribeGuestCart(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const hasGuestCart = useSyncExternalStore(
    subscribeGuestCart,
    () => getGuestCart().length > 0,
    () => false
  );

  useEffect(() => {
    const isRegistered =
      new URLSearchParams(window.location.search).get("registered") === "true";

    if (isRegistered) {
      const timer = window.setTimeout(
        () =>
          toast(
            "Registrasi berhasil. Silakan verifikasi email kamu, lalu login.",
            "success"
          ),
        0
      );
      return () => window.clearTimeout(timer);
    }
  }, [toast]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    // Login ke Supabase Auth.
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      toast(authError.message, "error");
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setError("User tidak ditemukan.");
      toast("User tidak ditemukan.", "error");
      setLoading(false);
      return;
    }

    try {
      const customer = await getOrCreateCustomerProfile(user);
      const guestItems = getGuestCart();

      if (guestItems.length > 0) {
        await mergeGuestCart(customer.id, guestItems);
        clearGuestCart();
      }
    } catch (profileError) {
      console.error("Gagal menyiapkan customer profile:", profileError);
      setError("Login berhasil, tetapi profil customer belum dapat disiapkan.");
      toast("Login berhasil, tetapi profil customer belum dapat disiapkan.", "error");
      setLoading(false);
      return;
    }

    // Login berhasil. Langsung arahkan user ke halaman produk.
    router.replace("/products");
  }

  function handleGuestLogin() {
    router.replace("/products");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#fffaf0] px-4 py-8 sm:px-6 sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-white shadow-2xl shadow-[#003f52]/10 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Banner Kiri */}
        <section className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#003f52] to-[#002633] p-8 text-white sm:p-12">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-[#d4af37]/20" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-[32px] border-white/5" />
          <div className="pointer-events-none absolute right-8 bottom-12 h-32 w-32 rounded-full bg-[#d4af37]/10 blur-2xl" />

          <div className="relative z-10">
            {/* Logo Badge */}
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#d4af37]/40 bg-white/10 shadow-inner backdrop-blur-sm">
                <Image
                  src="/Cannie.png"
                  alt="Cannie Gift"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                  Cannie Gift
                </span>
                <span className="text-xs text-white/70">Florist & Gift Shop</span>
              </div>
            </div>

            <h1 className="mt-8 text-2xl font-bold tracking-tight leading-tight sm:text-3xl lg:text-4xl">
              Hadiah manis untuk momen yang tak terlupakan.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Masuk ke akunmu untuk melanjutkan pesanan, menyimpan produk favorit, dan mengakses riwayat belanja.
            </p>

            {/* Benefit Highlights */}
            <div className="mt-8 space-y-3.5 border-t border-white/10 pt-6 text-sm text-white/90">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Bouquet bunga premium segar & artificial pilihan</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Keranjang belanja tersimpan rapi dan aman</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Pantau status pemesanan secara langsung</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Kanan */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto w-full max-w-md">
            <div>
              <span className="inline-block rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-semibold text-[#8a6e13]">
                Selamat Datang Kembali
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#003f52] sm:text-3xl">
                Login ke Akun
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Masukkan email dan kata sandi yang telah terdaftar.
              </p>
            </div>

            {/* Guest Cart Notification Banner */}
            {hasGuestCart && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#d4af37]/40 bg-[#fffaf0] p-3 text-xs text-[#8a6e13]">
                <span className="text-base">🛍️</span>
                <span>
                  <strong>Ada produk di keranjangmu!</strong> Produk ini akan otomatis digabungkan ke akunmu setelah login.
                </span>
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-[#fffaf0]/30 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:bg-white focus:ring-4 focus:ring-[#d4af37]/15"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-[#fffaf0]/30 py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:bg-white focus:ring-4 focus:ring-[#d4af37]/15"
                    placeholder="Masukkan password kamu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Inline Error Message */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#003f52] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#003f52]/20 transition hover:bg-[#00526b] focus:outline-none focus:ring-4 focus:ring-[#003f52]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses login...</span>
                  </>
                ) : (
                  <span>Masuk ke Akun</span>
                )}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-gray-400">
                Atau
              </span>
            </div>

            {/* Guest Checkout / Continue Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#fffaf0]/60 px-6 py-3 text-sm font-semibold text-[#003f52] transition hover:border-[#d4af37] hover:bg-[#fffaf0] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/20"
            >
              <span>Lanjut Belanja sebagai Guest</span>
              <svg className="h-4 w-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#8a6e13] underline-offset-4 hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              Kamu bebas berbelanja dan checkout tanpa harus membuat akun.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
