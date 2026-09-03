"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrderId(new URLSearchParams(window.location.search).get("order") ?? "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center bg-[#fffaf0] px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">✓</div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#9b7b12]">Cannie Gift</p>
        <h1 className="mt-3 text-3xl font-bold text-[#003f52]">Pesanan berhasil dibuat</h1>
        <p className="mt-4 leading-7 text-gray-600">Terima kasih. Pesananmu sudah tercatat dan akan segera kami proses.</p>
        {orderId && <p className="mt-5 break-all rounded-xl bg-gray-50 p-3 text-xs text-gray-500">Nomor pesanan: {orderId}</p>}
        <Link href="/products" className="mt-7 inline-block rounded-xl bg-[#003f52] px-6 py-3 font-semibold text-white transition hover:bg-[#00566d]">Kembali Belanja</Link>
      </div>
    </main>
  );
}
