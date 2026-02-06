import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    "@react-three/cannon",
    "@pmndrs/cannon-worker-api",
  ],
};

export default nextConfig;
