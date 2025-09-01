import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // يمكنك إضافة خيارات تجريبية هنا إذا كنت تستخدم ميزات تجريبية
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // يمكن استخدام * للحصول على جميع المسارات
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**", // يمكن استخدام * للحصول على جميع المسارات
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // يمكن استخدام * للحصول على جميع المسارات
      },
    ],
    domains: ["images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Handle Supabase WebSocket connections
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push("ws");
    }

    return config;
  },
};

export default nextConfig;
