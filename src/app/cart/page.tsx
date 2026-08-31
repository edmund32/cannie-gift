import Link from "next/link";
import { redirect } from "next/navigation";

import { supabase } from "../../lib/supabase";
import { getCustomerByUserId } from "../../services/customerService";
import { getCartItems } from "../../services/cartService";

export default async function CartPage() {
  // 1. Ambil user yang sedang login.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Kalau belum login, arahkan ke halaman login.
  if (!user) {
    redirect("/login");
  }

  // 2. Cari customer berdasarkan user.id.
  const customer = await getCustomerByUserId(user.id);

  // Kalau customer profile belum ada,
  // arahkan kembali ke halaman products.
  if (!customer) {
    redirect("/products");
  }

  // 3. Ambil item cart milik customer.
  const cartItems = await getCartItems(customer.id);

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
                  {item.products?.[0]?.name}
                </h2>

                <p className="mt-1 text-gray-600">
                  Rp{" "}
                  {item.products?.[0]?.price.toLocaleString("id-ID")}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}