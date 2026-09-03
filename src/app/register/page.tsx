"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { createCustomerProfile } from "../../services/customerService";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    // Membuat akun di Supabase Auth.
    // Data customer disimpan sementara di user metadata.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          address,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Jika konfirmasi email tidak diwajibkan, session tersedia dan profil
    // customer dapat dibuat langsung setelah akun Auth berhasil dibuat.
    if (data.user && data.session) {
      try {
        await createCustomerProfile(data.user.id, {
          name,
          phone,
          email,
          address,
        });
      } catch (profileError) {
        console.error("Gagal membuat customer profile:", profileError);
        setError("Akun berhasil dibuat, tetapi profil customer belum tersimpan.");
        setLoading(false);
        return;
      }
    }

    // Karena Confirm Email aktif,
    // user harus melakukan verifikasi email terlebih dahulu.
    setLoading(false);
    router.replace("/login?registered=true");
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
              Mulai berbagi kebahagiaan hari ini.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-white/70">
              Buat akun untuk menyimpan keranjang dan menikmati pengalaman
              belanja yang lebih praktis.
            </p>
          </div>
        </section>

        <section className="px-8 py-10 sm:px-12 sm:py-14">
          <div className="max-w-md">
            <p className="text-sm font-medium text-[#9b7b12]">Bergabung bersama kami</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#003f52]">
              Buat akun baru
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Isi data berikut untuk mulai berbelanja di Cannie Gift.
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                  Nama lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 bg-[#fffaf0]/50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/15"
                  placeholder="Nama lengkap"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
                  Nomor telepon
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  autoComplete="tel"
                  className="w-full rounded-xl border border-gray-200 bg-[#fffaf0]/50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/15"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

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
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 bg-[#fffaf0]/50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/15"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-semibold text-gray-700">
                  Alamat <span className="font-normal text-gray-400">(opsional)</span>
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  autoComplete="street-address"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#fffaf0]/50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/15"
                  placeholder="Alamat pengiriman"
                  rows={3}
                />
              </div>

              {message && (
                <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-5 text-green-700">
                  {message}
                </p>
              )}

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
                {loading ? "Sedang mendaftarkan..." : "Buat akun"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-[#9b7b12] underline-offset-4 hover:underline">
                Login sekarang
              </Link>
            </p>
            <p className="mt-4 text-center text-xs text-gray-400">
              Kamu tetap bisa berbelanja sebagai guest tanpa membuat akun.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
