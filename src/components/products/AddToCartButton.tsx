"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getOrCreateCustomerProfile } from "@/services/customerService";
import { addToCart } from "@/services/cartService";
import { addGuestCartItem } from "@/services/guestCartService";
import { useToast } from "@/components/ui/ToastProvider";

type AddToCartButtonProps = {
  productId: string;
  variant?: "default" | "icon" | "full";
  className?: string;
};

export default function AddToCartButton({
  productId,
  variant = "default",
  className,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleAddToCart(e?: React.MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    try {
      setLoading(true);

      // Ambil user yang sedang login.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        addGuestCartItem(productId);
        toast("Produk berhasil ditambahkan ke keranjang!", "success");
        return;
      }

      // Cari customer berdasarkan user.id.
      const customer = await getOrCreateCustomerProfile(user);

      // Tambahkan produk ke cart.
      await addToCart(customer.id, productId);

      toast("Produk berhasil ditambahkan ke keranjang!", "success");
    } catch (error) {
      console.error(error);
      toast("Gagal menambahkan produk ke keranjang.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        title="Tambah ke keranjang"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003f52] text-white shadow-sm transition hover:bg-[#d4af37] hover:text-[#003f52] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )}
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        className={`inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#003f52] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#003f52]/20 transition duration-300 hover:bg-[#00526b] hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
      >
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Menambahkan ke Keranjang...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Tambah ke Keranjang</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      className={`mt-8 rounded-lg bg-[#003f52] px-6 py-3 text-white transition hover:bg-[#00566d] disabled:opacity-50 ${className ?? ""}`}
    >
      {loading ? "Menambahkan..." : "Tambah ke Keranjang"}
    </button>
  );
}
