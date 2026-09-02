"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(currentUser);
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Gagal logout:", error);
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[#d4af37]/30 bg-[#003f52]/95 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/products" className="transition hover:scale-[1.02]">
          <Image src="/Cannie.png" alt="Cannie Gift and Florist" width={64} height={64} className="h-12 w-12 object-cover" />
        </Link>

        {loading ? (
          <span className="text-sm text-gray-400">Memuat...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="text-sm text-white/80 transition hover:text-[#d4af37]"
            >
              Keranjang
            </Link>

            <span className="hidden text-sm text-gray-600 sm:inline">
              {user.email}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-[#d4af37]/60 px-3 py-2 text-sm transition hover:bg-[#d4af37] hover:text-[#003f52] disabled:opacity-50"
            >
              {loggingOut ? "Logout..." : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="hover:text-[#d4af37]">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#d4af37] px-3 py-2 text-[#003f52] transition hover:bg-[#e3c354]"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
