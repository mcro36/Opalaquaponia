import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/Opalaquaponia",
  assetPrefix: "/Opalaquaponia/",
  images: { unoptimized: true },
};

export default nextConfig;
