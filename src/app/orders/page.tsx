"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getOrCreateCustomerProfile } from "@/services/customerService";
import { cancelCustomerOrder, getCustomerOrders } from "@/services/orderService";
import { useToast } from "@/components/ui/ToastProvider";

type Order = {
  id: string;
  payment_status: string;
  order_status: string;
  total: number;
  created_at: string;
  order_items: { id: string; product_name: string; quantity: number }[];
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast, confirm } = useToast();

  useEffect(() => {
    async function loadOrders() {
      try {
        setOrderSuccess(new URLSearchParams(window.location.search).get("success") === "true");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login");
          return;
        }

        const customer = await getOrCreateCustomerProfile(user);
        setCustomerId(customer.id);
        setOrders((await getCustomerOrders(customer.id)) as Order[]);
      } catch (loadError) {
        console.error("Gagal memuat riwayat pesanan:", loadError);
        setError("Riwayat pesanan belum dapat dimuat.");
        toast("Riwayat pesanan belum dapat dimuat.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router, toast]);

  async function handleCancel(orderId: string) {
    if (!customerId || !(await confirm("Batalkan pesanan ini?"))) return;

    try {
      await cancelCustomerOrder(orderId, customerId);
      setOrders((currentOrders) => currentOrders.map((order) =>
        order.id === orderId ? { ...order, order_status: "cancelled" } : order
      ));
      toast("Pesanan berhasil dibatalkan.", "success");
    } catch (cancelError) {
      console.error("Gagal membatalkan pesanan:", cancelError);
      toast("Pesanan tidak dapat dibatalkan. Mungkin sudah diproses.", "error");
    }
  }

  return (
    <main className="flex-1 bg-[#fffaf0] px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {orderSuccess && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
            Pesanan berhasil dibuat. Terima kasih sudah berbelanja di Cannie Gift.
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-[#003f52]">Pesanan Saya</h1>
        <p className="mt-2 text-gray-600">Lihat status dan detail pesananmu.</p>

        {loading && <div className="mt-8 rounded-2xl bg-white p-8 text-gray-600 shadow-sm">Memuat riwayat pesanan...</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#d4af37]/25 bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-[#003f52]">Belum ada pesanan.</p>
            <Link href="/products" className="mt-5 inline-block rounded-xl bg-[#003f52] px-6 py-3 font-semibold text-white">Mulai Belanja</Link>
          </div>
        )}
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-[#d4af37]/25 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</p><p className="mt-1 break-all text-xs text-gray-400">#{order.id}</p></div>
                <div className="flex flex-wrap justify-end gap-2">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold capitalize text-amber-800">Pembayaran: {order.payment_status}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${order.order_status === "cancelled" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>{order.order_status}</span>
                </div>
              </div>
              <div className="mt-5 border-t border-gray-100 pt-4 text-sm text-gray-600">
                {order.order_items?.map((item) => <p key={item.id}>{item.product_name} × {item.quantity}</p>)}
              </div>
              <p className="mt-4 text-right text-lg font-bold text-[#003f52]">Rp {Number(order.total).toLocaleString("id-ID")}</p>
              {order.order_status === "pending" && (
                <button type="button" onClick={() => handleCancel(order.id)} className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                  Batalkan Pesanan
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
