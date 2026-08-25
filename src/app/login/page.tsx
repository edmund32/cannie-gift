"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    // Login menggunakan email dan password Supabase Auth.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Login berhasil, arahkan ke halaman products.
    window.location.href = "/products";
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-bold">
        Login
      </h1>

      <p className="mt-2 text-gray-600">
        Login untuk melanjutkan belanja di Cannie Gift.
      </p>

      <form
        onSubmit={handleLogin}
        className="mt-8 space-y-4"
      >
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
            className="w-full rounded-lg border px-4 py-3"
            placeholder="Password"
          />
        </div>

        {/* Error */}
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
          {loading ? "Login..." : "Login"}
        </button>
      </form>
    </main>
  );
}