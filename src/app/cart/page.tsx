"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { getOrCreateCustomerProfile } from "@/services/customerService";
import { getProductById } from "@/services/productService";
import {
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cartService";
import {
  getGuestCart,
  removeGuestCartItem,
  updateGuestCartItem,
} from "@/services/guestCartService";

type CartDisplayItem = {
  id: string;
  quantity: number;
  products: {
    id?: string;
    name: string;
    price: number;
    image_url?: string;
  } | null;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        // 1. Ambil user yang sedang login.
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          const guestItems = getGuestCart();
          const guestProducts = await Promise.all(
            guestItems.map(async (guestItem) => {
              const product = await getProductById(guestItem.productId);
              return {
                id: guestItem.productId,
                quantity: guestItem.quantity,
                products: product
                  ? {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image_url: product.image_url,
                    }
                  : null,
              };
            })
          );

          setCartItems(
            guestProducts.filter((item) => item.products !== null)
          );
          return;
        }

        // 2. Cari customer berdasarkan user.id.
        const customer = await getOrCreateCustomerProfile(user);

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
    if (newQuantity < 1) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        updateGuestCartItem(cartItemId, newQuantity);
        setCartItems((currentItems) =>
          currentItems.map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        return;
      }

      await updateCartItemQuantity(cartItemId, newQuantity);

      const customer = await getOrCreateCustomerProfile(user);

      if (!customer) {
        return;
      }

      const items = await getCartItems(customer.id);

      setCartItems(items);
    } catch (error) {
      console.error("Gagal mengubah quantity:", error);
    }
  }

  async function handleRemoveItem(cartItemId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        removeGuestCartItem(cartItemId);
        setCartItems((currentItems) =>
          currentItems.filter((item) => item.id !== cartItemId)
        );
        return;
      }

      await removeCartItem(cartItemId);
      setCartItems((currentItems) =>
        currentItems.filter((item) => item.id !== cartItemId)
      );
    } catch (error) {
      console.error("Gagal menghapus item:", error);
    }
  }

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.products?.price ?? 0) * item.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf0] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-gray-200" />
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-3xl bg-white/80 p-6 shadow-sm"
                />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-3xl bg-white/80 p-6 shadow-sm lg:col-span-4" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf0] pb-24 text-gray-800">
      {/* Top Header & Breadcrumb */}
      <section className="border-b border-[#d4af37]/20 bg-white/70 px-4 py-4 backdrop-blur-xs sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-gray-500">
            <Link href="/products" className="transition hover:text-[#003f52]">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/catalog" className="transition hover:text-[#003f52]">
              Katalog
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#003f52]">Keranjang Belanja</span>
          </nav>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 font-semibold text-[#003f52] transition hover:text-[#d4af37]"
          >
            <span>← Lanjut Belanja Bouquet</span>
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9b7b12] shadow-2xs">
            ✦ Your Shopping Bag ✦
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#003f52] sm:text-3xl lg:text-4xl">
              Keranjang Belanja
            </h1>
            {cartItems.length > 0 && (
              <span className="text-sm font-semibold text-gray-500">
                ({cartItems.length} jenis bouquet, {totalQuantity} item)
              </span>
            )}
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-[#d4af37]/30 bg-white p-10 text-center shadow-lg sm:p-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fffaf0] border border-[#d4af37]/40 text-4xl shadow-inner">
              💐
            </div>
            <h2 className="mt-6 text-xl font-bold text-[#003f52] sm:text-2xl">
              Keranjang Belanjamu Masih Kosong
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 leading-relaxed">
              Belum ada rangkaian bouquet manis yang kamu tambahkan. Yuk, pilih bouquet segar, artificial, atau snack favoritmu!
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-[#003f52] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#003f52]/20 transition hover:bg-[#00526b] hover:shadow-lg"
              >
                <span>Jelajahi Katalog Bouquet</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Items Grid & Summary */
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Daftar Item Cart */}
            <div className="space-y-4 lg:col-span-8">
              {cartItems.map((item) => {
                const product = item.products;
                const price = product?.price ?? 0;
                const subtotal = price * item.quantity;
                const productLink = product?.id ? `/products/${product.id}` : "/catalog";

                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-[#d4af37]/25 bg-white p-4 shadow-sm transition hover:border-[#d4af37]/60 hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                  >
                    {/* Gambar Produk */}
                    <Link
                      href={productLink}
                      className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#fffaf0] border border-gray-100 sm:h-28 sm:w-28"
                    >
                      {product?.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          🌸
                        </div>
                      )}
                    </Link>

                    {/* Rincian Produk */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link href={productLink}>
                            <h3 className="text-base font-bold text-gray-900 transition hover:text-[#003f52] sm:text-lg">
                              {product?.name || "Bouquet Cannie Gift"}
                            </h3>
                          </Link>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Hapus dari keranjang"
                            className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          Harga satuan:{" "}
                          <span className="font-semibold text-gray-700">
                            Rp {price.toLocaleString("id-ID")}
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:mt-3">
                        {/* Quantity Controller */}
                        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50/80 p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-2xs transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Kurangi"
                          >
                            -
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-[#003f52]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 shadow-2xs transition hover:bg-gray-100"
                            title="Tambah"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal Per Item */}
                        <div className="text-right">
                          <span className="block text-[10px] uppercase text-gray-400">Subtotal</span>
                          <span className="text-base font-extrabold text-[#003f52]">
                            Rp {subtotal.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Kolom Kanan: Ringkasan Belanja (Sticky) */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-[#d4af37]/35 bg-white p-6 shadow-xl shadow-[#003f52]/5 lg:sticky lg:top-24">
                <h3 className="text-base font-bold text-[#003f52]">
                  Ringkasan Belanja
                </h3>

                <div className="mt-5 space-y-3 border-b border-gray-100 pb-4 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Item</span>
                    <span className="font-semibold text-gray-900">{totalQuantity} pcs</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-medium text-emerald-700">Dihitung saat checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kartu Ucapan</span>
                    <span className="font-semibold text-[#9b7b12]">Gratis (Include)</span>
                  </div>
                </div>

                {/* Total Bayar */}
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Belanja</span>
                  <span className="text-2xl font-black text-[#003f52]">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#003f52] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#003f52]/20 transition duration-300 hover:bg-[#00526b] hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>Lanjut ke Checkout</span>
                  <span>→</span>
                </Link>

                {/* Jaminan Keamanan & Belanja */}
                <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Proses checkout aman & data terjaga</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>100% Handcrafted oleh florist berpengalaman</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Kemasan rapi dengan kardus pelindung khusus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
