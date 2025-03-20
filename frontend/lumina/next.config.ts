import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


  // Proxy file upload requests directly to backend server since Vercel limits request body size to 4.5 MB, which is mostly not enough for image files
  async rewrites() {
    return [
      {
        source: "/api/upload",
        destination: `${process.env.BACKEND_URL}/api/upload`,
      },
    ];
  },
};

export default nextConfig;
