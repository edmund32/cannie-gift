"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";
import { getOrCreateCustomerProfile } from "../../services/customerService";
import { getProductById } from "../../services/productService";
import {
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../../services/cartService";
import {
  getGuestCart,
  removeGuestCartItem,
  updateGuestCartItem,
} from "../../services/guestCartService";

type CartDisplayItem = {
  id: string;
  quantity: number;
  products: {
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
            guestItems.map(async (guestItem) => ({
              id: guestItem.productId,
              quantity: guestItem.quantity,
              products: await getProductById(guestItem.productId),
            }))
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

  if (loading) {
    return (
      <main className="flex-1 bg-[#fffaf0] px-6 py-12">
        <div className="mx-auto max-w-6xl animate-pulse rounded-2xl bg-white p-8 text-gray-400 shadow-sm">
          Memuat keranjang...
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#fffaf0] px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-6xl">
        <Link
          href="/products"
            className="text-sm text-gray-600 hover:text-[#003f52]"
        >
          ← Kembali ke Produk
        </Link>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#003f52]">
          Keranjang Saya
        </h1>
      </div>

      {/* Cart kosong */}
      {cartItems.length === 0 ? (
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#d4af37]/25 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#003f52]">
            Keranjang kamu masih kosong.
          </p>

          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-[#003f52] px-6 py-3 text-white hover:bg-[#00566d]"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-[#d4af37]/20 bg-white p-4 shadow-sm sm:gap-6 sm:p-5"
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#fffaf0] sm:h-36 sm:w-36">
                {item.products?.image_url && (
                  <Image
                    src={item.products.image_url}
                    alt={item.products.name}
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Informasi produk */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#003f52] sm:text-xl">
                  {item.products?.name}
                </h2>

                <p className="mt-1 text-gray-600">
                  Rp{" "}
                  {item.products?.price?.toLocaleString("id-ID")}
                </p>

                <p className="mt-1 font-medium">
                  Subtotal: Rp{" "}
                  {((item.products?.price ?? 0) * item.quantity).toLocaleString(
                    "id-ID"
                  )}
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

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="mt-3 text-sm text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          </div>

          <div className="rounded-2xl border border-[#d4af37]/25 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Ringkasan belanja</p>
            <p className="mt-5 flex items-center justify-between border-b border-gray-100 pb-4 text-sm text-gray-600">
              <span>{cartItems.length} item</span>
              <span>Belum termasuk ongkir</span>
            </p>
            <p className="mt-4 flex items-center justify-between text-lg font-bold text-[#003f52]">
              <span>Total</span>
              Total: Rp {totalPrice.toLocaleString("id-ID")}
            </p>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-xl bg-[#003f52] px-5 py-3.5 text-center font-semibold text-white transition hover:bg-[#00566d]"
            >
              Lanjut Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

