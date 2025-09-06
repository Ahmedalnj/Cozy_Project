import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // السماح بإكمال البناء على Vercel حتى لو وُجدت أخطاء ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // السماح بإكمال البناء حتى لو وُجدت أخطاء TypeScript
    ignoreBuildErrors: true,
  },
  experimental: {
    // يمكنك إضافة خيارات تجريبية هنا إذا كنت تستخدم ميزات تجريبية
  },
  // إعدادات Content Security Policy
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.stripe.com https://maps.googleapis.com wss:",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // تحسين تحميل الملفات الثابتة
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  // تحسين تحميل CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
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
