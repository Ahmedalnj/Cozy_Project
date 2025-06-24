import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "scontent.fblr1-1.fna.fbcdn.net",
      "scontent.fblr1-2.fna.fbcdn.net",
      "scontent.fblr1-3.fna.fbcdn.net",
      "scontent.fblr1-4.fna.fbcdn.net",
      "scontent.fblr1-5.fna.fbcdn.net", 
    ]
  }
};

export default nextConfig;
