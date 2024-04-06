import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],
  importMap: "@stylespixelkit",

  // Useful for theme customization
  theme: {
    extend: {},
    tokens: {
      fontSizes: {
        xlg: { value: "18px" },
        xxlg: { value: "22px" },
        xxxlg: { value: "26px" },
        lg: { value: "larger" },
        md: { value: "medium" },
        sm: {
          value: "small",
        },
      },
      borders: {
        // string value
        container: { value: "0.1px solid #424242" },
        selected: { value: "1px solid " },
        secondary: { value: "rgb(0, 153, 255)" },
      },
      gradients: {
        primary: {
          value:
            "linear-gradient(315deg, rgb(0, 153, 255) 0%, var(--token-ee053477-e115-4fec-a5f5-cdc637ed6ddc, rgb(0, 204, 255))  100%)",
        },
      },
      spacing: {
        sm: { value: "4px" },
        md: {
          value: "6px",
        },
        lg: { value: "12px" },
        xlg: { value: "18px" },
        xxlg: { value: "22px" },
        xxxlg: { value: "26px" },
      },
      radii: {
        sm: { value: "8px" },
        md: {
          value: "6px",
        },
        lg: { value: "8px" },
      },
      colors: {
        primary: {
          value: "#0d0e0e",
        },
        secondary: { value: "rgb(0, 153, 255)" },
        danger: { value: "#bb2124" },
        text: {
          value: "white",
        },
      },
      fontWeights: {
        bold: {
          value: "bold",
        },
        normal: {
          value: "normal",
        },
        lighter: {
          value: "lighter",
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
