import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages hosts the static export from /out.
  output: "export",
};

export default nextConfig;
