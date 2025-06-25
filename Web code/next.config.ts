import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // يمكنك إضافة خيارات تجريبية هنا إذا كنت تستخدم ميزات تجريبية
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**', // يمكن استخدام * للحصول على جميع المسارات
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        pathname: '/**', // يمكن استخدام * للحصول على جميع المسارات
      },
    ],
  },
};

module.exports = nextConfig;