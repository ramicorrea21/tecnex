import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: [
      'localhost', // Para desarrollo
      'firebasestorage.googleapis.com' // Para producción
    ]
  }
}

export default nextConfig;
