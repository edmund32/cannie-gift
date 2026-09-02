import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan membuka dev server melalui IP komputer di jaringan lokal.
  allowedDevOrigins: ["10.30.90.105"],
};

export default nextConfig;
