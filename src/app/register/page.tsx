"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
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
    const { error } = await supabase.auth.signUp({
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

    // Karena Confirm Email aktif,
    // user harus melakukan verifikasi email terlebih dahulu.
    setMessage(
      "Registrasi berhasil! Silakan cek email kamu untuk melakukan verifikasi sebelum login."
    );

    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-bold">
        Register
      </h1>

      <p className="mt-2 text-gray-600">
        Buat akun untuk mulai berbelanja di Cannie Gift.
      </p>

      <form
        onSubmit={handleRegister}
        className="mt-8 space-y-4"
      >
        {/* Nama */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nama
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
            placeholder="Nama lengkap"
          />
        </div>

        {/* Nomor telepon */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nomor Telepon
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
            placeholder="email@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border px-4 py-3"
            placeholder="Minimal 6 karakter"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Alamat
          </label>

          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="w-full rounded-lg border px-4 py-3"
            placeholder="Alamat pengiriman"
            rows={3}
          />
        </div>

        {/* Pesan berhasil */}
        {message && (
          <p className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {/* Pesan error */}
        {error && (
          <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Mendaftarkan..." : "Register"}
        </button>
      </form>
    </main>
  );
}