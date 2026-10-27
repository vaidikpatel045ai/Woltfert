import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Placeholder photography is served from Unsplash.
    // To use the boutique's own photos: drop them in /public/images and change
    // the paths in lib/data.ts (the `img` map) to e.g. "/images/hero.jpg".
    // You can then delete this remote pattern.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    optimizePackageImports: ["gsap", "@react-three/drei"],
  },
};

export default nextConfig;
