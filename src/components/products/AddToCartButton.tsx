"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCustomerByUserId } from "@/services/customerService";
import { addToCart } from "@/services/cartService";

type AddToCartButtonProps = {
  productId: string;
};

export default function AddToCartButton({
  productId,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);

      // Ambil user yang sedang login.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Silakan login terlebih dahulu.");
        return;
      }

      // Cari customer berdasarkan user.id.
      const customer = await getCustomerByUserId(user.id);

      if (!customer) {
        alert("Customer profile tidak ditemukan.");
        return;
      }

      // Tambahkan produk ke cart.
      await addToCart(customer.id, productId);

      alert("Produk berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan produk ke keranjang.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      className="mt-8 rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-80 disabled:opacity-50"
    >
      {loading ? "Menambahkan..." : "Tambah ke Keranjang"}
    </button>
  );
}