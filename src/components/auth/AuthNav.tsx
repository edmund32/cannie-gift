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
    <header className="sticky top-0 z-20 border-b border-[#d4af37]/25 bg-[#003f52]/95 text-white shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/products" className="group flex items-center gap-3 transition">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#d4af37]/60 bg-white p-0.5 shadow-sm transition group-hover:scale-105 sm:h-11 sm:w-11">
            <Image
              src="/Cannie.png"
              alt="Cannie Gift"
              fill
              sizes="44px"
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white transition group-hover:text-[#d4af37] leading-tight">
              Cannie Gift
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
              Since 2020
            </span>
          </div>
        </Link>

        {/* Center Main Nav (Only on non-auth pages) */}
        {!isAuthPage && (
          <div className="hidden items-center gap-1.5 md:flex">
            <Link
              href="/products"
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wide transition ${
                pathname === "/products"
                  ? "bg-white/15 text-[#d4af37] shadow-2xs"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/catalog"
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wide transition ${
                pathname === "/catalog" || pathname.startsWith("/products/")
                  ? "bg-white/15 text-[#d4af37] shadow-2xs"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              Katalog Bouquet
            </Link>
          </div>
        )}

        {/* Right Actions: Cart, Orders, Auth */}
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
            <span className="text-xs text-white/60">Memuat...</span>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 text-xs sm:gap-4">
            {/* Cart Link (Hidden on auth page and for admin) */}
            {!isAuthPage && !isAdmin && (
              <Link
                href="/cart"
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
                  pathname === "/cart"
                    ? "bg-[#d4af37] text-[#003f52] font-bold shadow-xs"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                title="Keranjang Belanja"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:inline">Keranjang</span>
              </Link>
            )}

            {!isAuthPage && !isAdmin && (
              <Link
                href="/orders"
                className={`rounded-xl px-2.5 py-1.5 font-semibold transition ${
                  pathname === "/orders"
                    ? "text-[#d4af37]"
                    : "text-white/80 hover:text-[#d4af37]"
                }`}
              >
                Pesanan
              </Link>
            )}

            {isAdmin && (
              <Link
                href={pathname === "/admin" ? "/products" : "/admin"}
                className="rounded-xl border border-[#d4af37] bg-[#d4af37]/20 px-3 py-1 font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-[#003f52]"
              >
                {pathname === "/admin" ? "← Ke Toko" : "Admin Panel"}
              </Link>
            )}

            {!isAuthPage && (
              <span className="hidden max-w-[140px] truncate text-white/70 lg:inline" title={user.email ?? ""}>
                {user.email}
              </span>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border border-white/25 px-3 py-1.5 font-medium text-white/80 transition hover:border-[#d4af37] hover:bg-white/10 hover:text-[#d4af37] disabled:opacity-50"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        ) : !isAuthPage ? (
          <div className="flex items-center gap-2.5 text-xs sm:gap-3">
            {/* Cart Link for Guests */}
            <Link
              href="/cart"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
                pathname === "/cart"
                  ? "bg-[#d4af37] text-[#003f52] font-bold shadow-xs"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              title="Keranjang Belanja"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline">Keranjang</span>
            </Link>

            <Link
              href="/login"
              className="px-2 py-1.5 font-semibold text-white/85 transition hover:text-[#d4af37]"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-[#d4af37] px-3.5 py-1.5 font-bold text-[#003f52] shadow-xs transition hover:bg-[#e3c354] hover:shadow-md"
            >
              Register
            </Link>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
