import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan membuka dev server melalui IP komputer di jaringan lokal.
  allowedDevOrigins: ["10.30.90.105"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname,
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
