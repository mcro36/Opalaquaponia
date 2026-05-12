import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/rjpiscicultura",
  assetPrefix: "/rjpiscicultura/",
  images: { unoptimized: true },
};

export default nextConfig;
