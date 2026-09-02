"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";
import { getCustomerByUserId } from "../../services/customerService";
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
            className="text-sm text-gray-600 hover:text-[#003f52]"
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
            className="mt-4 inline-block rounded-lg bg-[#003f52] px-6 py-3 text-white hover:bg-[#00566d]"
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

          <div className="rounded-xl border bg-gray-50 p-4 text-right">
            <p className="text-lg font-bold">
              Total: Rp {totalPrice.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

