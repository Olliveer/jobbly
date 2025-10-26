import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   cacheComponents: true,
  // },
  // transpilePackages: ["next-mdx-remote"],
  experimental: {
    cacheComponents: true,
  },
};

export default nextConfig;
