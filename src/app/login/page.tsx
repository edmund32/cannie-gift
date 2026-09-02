"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const isRegistered =
      new URLSearchParams(window.location.search).get("registered") === "true";

    if (!isRegistered) return;

    const timer = window.setTimeout(() => setRegistered(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    // Login ke Supabase Auth.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setError("User tidak ditemukan.");
      setLoading(false);
      return;
    }

    // Login berhasil. Langsung arahkan user ke halaman produk.
    router.replace("/products");
  }

  return (
    <main className="flex flex-1 items-center bg-[#fffaf0] px-6 py-10 sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-white shadow-xl shadow-[#003f52]/10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[#003f52] px-8 py-10 text-white sm:px-12 sm:py-14">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[24px] border-[#d4af37]/20" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border-[28px] border-white/5" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d4af37]">
              Cannie Gift
            </p>
            <h1 className="mt-5 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
              Hadiah manis untuk momen yang berarti.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-white/70">
              Masuk ke akunmu untuk melanjutkan belanja dan menyimpan keranjang
              hadiah pilihanmu.
            </p>
          </div>
        </section>

        <section className="px-8 py-10 sm:px-12 sm:py-14">
          <div className="max-w-md">
            <p className="text-sm font-medium text-[#9b7b12]">Selamat datang kembali</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#003f52]">
              Login ke akunmu
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Login untuk melanjutkan belanja di Cannie Gift.
            </p>

            {registered && (
              <p role="status" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-5 text-green-700">
                Registrasi berhasil. Silakan verifikasi email kamu, lalu login.
              </p>
            )}

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 bg-[#fffaf0]/50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/15"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 bg-[#fffaf0]/50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/15"
                  placeholder="Masukkan password"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#003f52] px-6 py-3.5 font-semibold text-white transition hover:bg-[#00566d] focus:outline-none focus:ring-4 focus:ring-[#003f52]/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sedang login..." : "Login"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-[#9b7b12] underline-offset-4 hover:underline">
                Daftar sekarang
              </Link>
            </p>
            <p className="mt-4 text-center text-xs text-gray-400">
              Kamu juga bisa berbelanja sebagai guest tanpa login.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
