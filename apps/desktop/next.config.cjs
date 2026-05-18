/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pixelkit/core", "@pixelkit/editor", "@pixelkit/platform"],
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
};

module.exports = nextConfig;
