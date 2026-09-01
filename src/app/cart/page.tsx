"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";
import { getCustomerByUserId } from "../../services/customerService";
import {
  getCartItems,
  updateCartItemQuantity,
} from "../../services/cartService";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        // 1. Ambil user yang sedang login.
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }

        // 2. Cari customer berdasarkan user.id.
        const customer = await getCustomerByUserId(user.id);

        if (!customer) {
          console.error("Customer profile tidak ditemukan.");
          return;
        }

        // 3. Ambil isi cart.
        const items = await getCartItems(customer.id);

        setCartItems(items);
      } catch (error) {
        console.error("Gagal mengambil cart:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  async function handleUpdateQuantity(
  cartItemId: string,
  newQuantity: number
) {
  try {
    await updateCartItemQuantity(cartItemId, newQuantity);

    // Ambil ulang cart setelah quantity berubah.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const customer = await getCustomerByUserId(user.id);

    if (!customer) {
      return;
    }

    const items = await getCartItems(customer.id);

    setCartItems(items);
  } catch (error) {
    console.error("Gagal mengubah quantity:", error);
  }
}

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p>Memuat keranjang...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/products"
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Kembali ke Produk
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Keranjang Saya
        </h1>
      </div>

      {/* Cart kosong */}
      {cartItems.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-gray-500">
            Keranjang kamu masih kosong.
          </p>

          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-black px-6 py-3 text-white hover:opacity-80"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border p-4"
            >
              {/* Informasi produk */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {item.products?.name}
                </h2>

                <p className="mt-1 text-gray-600">
                  Rp{" "}
                  {item.products?.price?.toLocaleString("id-ID")}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="rounded border px-3 py-1 disabled:opacity-40"
                  >
                    -
                  </button>

                  <span className="min-w-8 text-center">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="rounded border px-3 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

