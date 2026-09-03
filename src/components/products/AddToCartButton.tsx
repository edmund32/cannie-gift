"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getOrCreateCustomerProfile } from "@/services/customerService";
import { addToCart } from "@/services/cartService";
import { addGuestCartItem } from "@/services/guestCartService";

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
        addGuestCartItem(productId);
        alert("Produk berhasil ditambahkan ke keranjang!");
        return;
      }

      // Cari customer berdasarkan user.id.
      const customer = await getOrCreateCustomerProfile(user);

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
      className="mt-8 rounded-lg bg-[#003f52] px-6 py-3 text-white transition hover:bg-[#00566d] disabled:opacity-50"
    >
      {loading ? "Menambahkan..." : "Tambah ke Keranjang"}
    </button>
  );
}
