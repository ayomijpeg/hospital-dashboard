import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is the correct, top-level placement for your Next.js version
  outputFileTracingIncludes: {
    // Include for your signup route
    '/api/auth/signup': [
      './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node'
    ],
    // Include for your login/callback routes
    '/api/auth/callback/*': [
      './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node'
    ]
  },
};

export default nextConfig;
