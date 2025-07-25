import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,

  },
  // experimental: {
  //   ppr: 'incremental',//'incremental' 值允许您为特定路由采用 PPR。
  // }
};

export default nextConfig;
