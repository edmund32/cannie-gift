"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const HAD_AUTH_SESSION_KEY = "cannie-had-auth-session";

export default function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const hadAuthenticatedSession = useRef(false);
  const pathnameRef = useRef(pathname);
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdmin = user?.app_metadata?.role === "admin";

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          hadAuthenticatedSession.current = true;
          window.localStorage.setItem(HAD_AUTH_SESSION_KEY, "true");
        } else if (
          window.localStorage.getItem(HAD_AUTH_SESSION_KEY) === "true"
        ) {
          hadAuthenticatedSession.current = true;
          router.replace("/login?session=expired");
        }
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        hadAuthenticatedSession.current = true;
        window.localStorage.setItem(HAD_AUTH_SESSION_KEY, "true");
      } else if (
        hadAuthenticatedSession.current &&
        pathnameRef.current !== "/login" &&
        pathnameRef.current !== "/register"
      ) {
        router.replace("/login?session=expired");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    // Bersihkan state lokal lebih dulu agar logout tidak tertahan oleh
    // koneksi jaringan ke Supabase.
    window.localStorage.removeItem(HAD_AUTH_SESSION_KEY);
    setUser(null);
    router.replace("/login");

    // Scope local menghapus session di browser tanpa menunggu sign-out global.
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        console.error("Gagal menyinkronkan logout ke Supabase:", error);
      }
    } catch (error) {
      console.error("Gagal menyinkronkan logout ke Supabase:", error);
    }

    setLoggingOut(false);
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
              className={`text-sm text-white/80 transition hover:text-[#d4af37] ${isAdmin ? "hidden" : ""}`}
            >
              Keranjang
            </Link>
            <Link
              href="/orders"
              className={`text-sm text-white/80 transition hover:text-[#d4af37] ${isAdmin ? "hidden" : ""}`}
            >
              Pesanan
            </Link>
            {isAdmin && (
              <Link href={pathname === "/admin" ? "/products" : "/admin"} className="text-sm text-white/80 transition hover:text-[#d4af37]">
                {pathname === "/admin" ? "← Products" : "Admin"}
              </Link>
            )}

            {!isAuthPage && (
              <span className="hidden text-sm text-white/75 sm:inline">
                {user.email}
              </span>
            )}

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
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/cart"
              className="text-white/80 transition hover:text-[#d4af37]"
            >
              Keranjang
            </Link>
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
