"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getProductById } from "@/services/productService";
import { getCartItems, clearCart } from "@/services/cartService";
import {
  createGuestCustomerProfile,
  getOrCreateCustomerProfile,
} from "@/services/customerService";
import { createOrder } from "@/services/orderService";
import { clearGuestCart, getGuestCart } from "@/services/guestCartService";
import { useToast } from "@/components/ui/ToastProvider";

type CheckoutItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const DELIVERY_FEE = 15000;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function loadCheckout() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id ?? null);

        if (user) {
          const customer = await getOrCreateCustomerProfile(user);
          setCustomerId(customer.id);
          setName(customer.name);
          setEmail(customer.email ?? user.email ?? "");
          setPhone(customer.phone);
          setAddress(customer.address ?? "");
          const cartItems = await getCartItems(customer.id);
          setItems(cartItems.flatMap((item) => item.products ? [{
            id: item.id,
            productId: item.product_id ?? "",
            name: item.products.name,
            price: Number(item.products.price),
            quantity: item.quantity,
            imageUrl: item.products.image_url,
          }] : []));
        } else {
          const guestItems = await Promise.all(getGuestCart().map(async (item) => {
            const product = await getProductById(item.productId);
            return product ? {
              id: item.productId,
              productId: item.productId,
              name: product.name,
              price: Number(product.price),
              quantity: item.quantity,
              imageUrl: product.image_url,
            } : null;
          }));
          setItems(guestItems.filter((item): item is NonNullable<typeof item> => item !== null));
        }
      } catch (loadError) {
        console.error("Gagal memuat checkout:", loadError);
        setError("Data checkout tidak dapat dimuat.");
        toast("Data checkout tidak dapat dimuat.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadCheckout();
  }, [toast]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const total = subtotal + DELIVERY_FEE;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const customer = customerId
        ? { id: customerId }
        : await createGuestCustomerProfile({ name, phone, email, address });

      const order = await createOrder({
        customerId: customer.id,
        deliveryMethod: "delivery",
        deliveryAddress: address,
        notes,
        deliveryFee: DELIVERY_FEE,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      });

      if (userId && customerId) await clearCart(customerId);
      else clearGuestCart();

      router.replace(
        userId ? `/orders?success=true&order=${order.id}` : `/order-success?order=${order.id}`
      );
    } catch (submitError) {
      console.error("Gagal membuat order:", submitError);
      setError("Order belum berhasil dibuat. Silakan coba lagi.");
      toast("Order belum berhasil dibuat. Silakan coba lagi.", "error");
      setSubmitting(false);
    }
  }

  if (loading) return <main className="flex-1 bg-[#fffaf0] p-10 text-center text-gray-600">Memuat checkout...</main>;

  if (items.length === 0) return (
    <main className="flex-1 bg-[#fffaf0] px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-[#003f52]">Keranjang masih kosong</h1>
      <p className="mt-3 text-gray-600">Tambahkan produk sebelum melanjutkan checkout.</p>
      <Link href="/products" className="mt-6 inline-block rounded-xl bg-[#003f52] px-6 py-3 font-semibold text-white">Pilih Produk</Link>
    </main>
  );

  return (
    <main className="flex-1 bg-[#fffaf0] px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link href="/cart" className="text-sm font-medium text-gray-600 hover:text-[#003f52]">← Kembali ke Keranjang</Link>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#003f52]">Checkout</h1>
        <p className="mt-2 text-gray-600">Lengkapi data pengiriman untuk menyelesaikan pesanan.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-[#d4af37]/25 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#003f52]">Data penerima</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">Nama lengkap<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#003f52]" /></label>
              <label className="text-sm font-semibold text-gray-700">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#003f52]" /></label>
              <label className="text-sm font-semibold text-gray-700">Nomor telepon<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#003f52]" /></label>
            </div>
            <label className="mt-5 block text-sm font-semibold text-gray-700">Alamat pengiriman<textarea required rows={4} value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#003f52]" /></label>
            <label className="mt-5 block text-sm font-semibold text-gray-700">Catatan <span className="font-normal text-gray-500">(opsional)</span><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#003f52]" /></label>
          </section>

          <aside className="h-fit rounded-2xl border border-[#d4af37]/25 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-[#003f52]">Ringkasan pesanan</h2>
            <div className="mt-5 space-y-4 border-b border-gray-100 pb-5">
              {items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="text-gray-600">{item.name} × {item.quantity}</span><span className="font-semibold text-gray-800">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span></div>)}
            </div>
            <div className="mt-5 space-y-3 text-sm text-gray-600"><div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString("id-ID")}</span></div><div className="flex justify-between"><span>Ongkir</span><span>Rp {DELIVERY_FEE.toLocaleString("id-ID")}</span></div></div>
            <div className="mt-5 flex justify-between border-t border-gray-100 pt-5 text-lg font-bold text-[#003f52]"><span>Total</span><span>Rp {total.toLocaleString("id-ID")}</span></div>
            <button disabled={submitting} className="mt-6 w-full rounded-xl bg-[#003f52] px-5 py-3.5 font-semibold text-white transition hover:bg-[#00566d] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Membuat pesanan..." : "Buat Pesanan"}</button>
          </aside>
        </form>
      </div>
    </main>
  );
}
