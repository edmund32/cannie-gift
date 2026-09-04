import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import AuthNav from "@/components/auth/AuthNav";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cannie Gift — Florist & Gift Shop",
  description: "Hadiah manis & bouquet bunga segar atau artificial untuk setiap momen spesial.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`h-full antialiased ${plusJakartaSans.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <ToastProvider>
          <AuthNav />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
