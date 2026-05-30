import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const desktopRoot = __dirname;
const workspaceRoot = path.resolve(desktopRoot, "../..");

export default defineConfig({
  plugins: [react()],
  base: "/",
  publicDir: path.join(desktopRoot, "public"),
  resolve: {
    alias: [
      {
        find: /^@\/db\/(.*)$/,
        replacement: `${path.join(workspaceRoot, "src/db")}/$1`,
      },
      {
        find: /^@\/editor$/,
        replacement: path.join(workspaceRoot, "packages/editor/src/index.tsx"),
      },
      {
        find: /^@\/editor\/(.*)$/,
        replacement: `${path.join(workspaceRoot, "packages/editor/src")}/$1`,
      },
      {
        find: /^@\/jotai\/(.*)$/,
        replacement: `${path.join(workspaceRoot, "src/jotai")}/$1`,
      },
      {
        find: /^@\/services\/(.*)$/,
        replacement: `${path.join(workspaceRoot, "src/services")}/$1`,
      },
      {
        find: /^@\/utils\/(.*)$/,
        replacement: `${path.join(workspaceRoot, "src/utils")}/$1`,
      },
      {
        find: /^@stylespixelkit\/(.*)$/,
        replacement: `${path.join(workspaceRoot, "styled-system")}/$1`,
      },
      {
        find: /^@pixelkit\/core$/,
        replacement: path.join(workspaceRoot, "packages/core/src/index.ts"),
      },
      {
        find: /^@pixelkit\/editor$/,
        replacement: path.join(workspaceRoot, "packages/editor/src/index.tsx"),
      },
      {
        find: /^@pixelkit\/platform$/,
        replacement: path.join(workspaceRoot, "packages/platform/src/index.ts"),
      },
      {
        find: /^@\//,
        replacement: `${path.join(desktopRoot, "src")}/`,
      },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 4210,
    strictPort: true,
    fs: {
      allow: [workspaceRoot],
    },
  },
  preview: {
    port: 4210,
    strictPort: true,
  },
  build: {
    outDir: path.join(desktopRoot, "renderer-dist"),
    emptyOutDir: true,
  },
});
