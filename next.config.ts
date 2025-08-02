import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Use relative imports for better subdirectory compatibility
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
