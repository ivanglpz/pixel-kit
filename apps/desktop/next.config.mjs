import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextSwcLoader = require.resolve(
  "next/dist/build/webpack/loaders/next-swc-loader",
);
const isDesktopExport =
  process.env.PIXELKIT_DESKTOP_EXPORT === "1" ||
  process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  output: isDesktopExport ? "export" : undefined,
  assetPrefix: isDesktopExport ? "./" : undefined,
  transpilePackages: ["@pixelkit/core", "@pixelkit/editor", "@pixelkit/platform"],
  experimental: {
    externalDir: true,
  },
  webpack: (config, options) => {
    const rootDir = process.cwd();
    const workspaceRoot = path.resolve(rootDir, "../..");
    const workspacePackageRule = {
      test: /\.[jt]sx?$/,
      include: [
        path.join(workspaceRoot, "packages"),
        path.join(rootDir, "node_modules/@pixelkit"),
      ],
      use: {
        loader: nextSwcLoader,
        options: {
          isServer: options.isServer,
          rootDir,
          pagesDir: path.join(rootDir, "src/pages"),
          appDir: undefined,
          hasReactRefresh: false,
          nextConfig: options.config,
          jsConfig: {},
          swcCacheDir: path.join(rootDir, ".next/cache/swc"),
          serverComponents: false,
          transpilePackages: [
            "@pixelkit/core",
            "@pixelkit/editor",
            "@pixelkit/platform",
          ],
        },
      },
    };
    const oneOfRule = config.module.rules.find((rule) =>
      Array.isArray(rule.oneOf),
    );

    config.resolve.symlinks = false;
    config.resolve.alias.canvas = false;
    config.resolve.alias["@stylespixelkit"] = path.join(
      workspaceRoot,
      "styled-system",
    );
    config.resolve.alias["@/db"] = path.join(workspaceRoot, "src/db");
    config.resolve.alias["@/editor"] = path.join(
      workspaceRoot,
      "packages/editor/src",
    );
    config.resolve.alias["@/jotai"] = path.join(workspaceRoot, "src/jotai");
    config.resolve.alias["@/pages"] = path.join(workspaceRoot, "src/pages");
    config.resolve.alias["@/services"] = path.join(
      workspaceRoot,
      "src/services",
    );
    config.resolve.alias["@/utils"] = path.join(workspaceRoot, "src/utils");
    config.resolve.alias.react = path.join(workspaceRoot, "node_modules/react");
    config.resolve.alias["react-dom"] = path.join(
      workspaceRoot,
      "node_modules/react-dom",
    );
    config.resolve.alias["react/jsx-runtime"] = path.join(
      workspaceRoot,
      "node_modules/react/jsx-runtime.js",
    );
    config.externals = [...config.externals, { canvas: "canvas" }];

    if (oneOfRule) {
      oneOfRule.oneOf.unshift(workspacePackageRule);
    } else {
      config.module.rules.unshift(workspacePackageRule);
    }

    return config;
  },
};

export default nextConfig;
