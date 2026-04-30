import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore - Opção necessária para desenvolvimento via IP na rede
    allowedDevOrigins: ["10.121.162.41", "localhost:3000"]
  }
};

export default nextConfig;
