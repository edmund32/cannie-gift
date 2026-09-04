"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type ConfirmRequest = {
  message: string;
  resolve: (confirmed: boolean) => void;
};

type ToastContextValue = {
  toast: (message: string, type?: Toast["type"]) => void;
  confirm: (message: string) => Promise<boolean>;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus digunakan di dalam ToastProvider.");
  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const confirm = useCallback((message: string) => new Promise<boolean>((resolve) => {
    setConfirmRequest({ message, resolve });
  }), []);

  function finishConfirm(confirmed: boolean) {
    confirmRequest?.resolve(confirmed);
    setConfirmRequest(null);
  }

  useEffect(() => () => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-end gap-3 sm:left-auto sm:max-w-sm" aria-live="polite">
        {toasts.map((item) => (
          <div
            key={item.id}
            role={item.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm shadow-xl ${
              item.type === "success" ? "border-green-200 text-green-800" :
              item.type === "error" ? "border-red-200 text-red-700" : "border-[#d4af37]/40 text-[#003f52]"
            }`}
          >
            <span className="flex-1">{item.message}</span>
            <button type="button" onClick={() => removeToast(item.id)} className="font-bold opacity-60 hover:opacity-100" aria-label="Tutup notifikasi">×</button>
          </div>
        ))}
      </div>

      {confirmRequest && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#003f52]/40 px-6" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="confirm-title" className="text-xl font-bold text-[#003f52]">Konfirmasi tindakan</h2>
            <p className="mt-3 text-gray-600">{confirmRequest.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => finishConfirm(false)} className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
              <button type="button" onClick={() => finishConfirm(true)} className="rounded-xl bg-[#003f52] px-4 py-2 font-semibold text-white hover:bg-[#00566d]">Ya, lanjutkan</button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
