import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  importMap: "@stylespixelkit",

  theme: {
    extend: {},
    tokens: {
      colors: {
        blue: {
          light: {
            "50": {
              value: "hsl(215, 90%, 90%)",
            },
            "100": {
              value: "hsl(215, 90.1%, 85.53%)",
            },
            "200": {
              value: "hsl(215, 90.2%, 71.5%)",
            },
            "300": {
              value: "hsl(215, 90.3%, 52.82%)",
            },
            "400": {
              value: "hsl(215, 90.4%, 38.82%)",
            },
            "500": {
              value: "hsl(215, 90.5%, 28.88%)",
            },
            "600": {
              value: "hsl(215, 90.6%, 21.49%)",
            },
            "700": {
              value: "hsl(215, 90.7%, 15.81%)",
            },
            "800": {
              value: "hsl(215, 90.8%, 11.35%)",
            },
            "900": {
              value: "hsl(215, 90.9%, 7.81%)",
            },
            "950": {
              value: "hsl(215, 91%, 5%)",
            },
          },
          dark: {
            "50": {
              value: "hsl(215, 91%, 5%)",
            },
            "100": {
              value: "hsl(215, 90.9%, 7.81%)",
            },
            "200": {
              value: "hsl(215, 90.8%, 11.35%)",
            },
            "300": {
              value: "hsl(215, 90.7%, 15.81%)",
            },
            "400": {
              value: "hsl(215, 90.6%, 21.49%)",
            },
            "500": {
              value: "hsl(215, 90.5%, 28.88%)",
            },
            "600": {
              value: "hsl(215, 90.4%, 38.82%)",
            },
            "700": {
              value: "hsl(215, 90.3%, 52.82%)",
            },
            "800": {
              value: "hsl(215, 90.2%, 71.5%)",
            },
            "900": {
              value: "hsl(215, 90.1%, 85.53%)",
            },
            "950": {
              value: "hsl(215, 90%, 90%)",
            },
          },
        },
        red: {
          light: {
            "50": {
              value: "hsl(352, 90%, 90%)",
            },
            "100": {
              value: "hsl(352, 90.5%, 85.53%)",
            },
            "200": {
              value: "hsl(352, 91%, 71.5%)",
            },
            "300": {
              value: "hsl(352, 91.5%, 52.82%)",
            },
            "400": {
              value: "hsl(352, 92%, 38.82%)",
            },
            "500": {
              value: "hsl(352, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(352, 93%, 21.49%)",
            },
            "700": {
              value: "hsl(352, 93.5%, 15.81%)",
            },
            "800": {
              value: "hsl(352, 94%, 11.35%)",
            },
            "900": {
              value: "hsl(352, 94.5%, 7.81%)",
            },
            "950": {
              value: "hsl(352, 95%, 5%)",
            },
          },
          dark: {
            "50": {
              value: "hsl(352, 95%, 5%)",
            },
            "100": {
              value: "hsl(352, 94.5%, 7.81%)",
            },
            "200": {
              value: "hsl(352, 94%, 11.35%)",
            },
            "300": {
              value: "hsl(352, 93.5%, 15.81%)",
            },
            "400": {
              value: "hsl(352, 93%, 21.49%)",
            },
            "500": {
              value: "hsl(352, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(352, 92%, 38.82%)",
            },
            "700": {
              value: "hsl(352, 91.5%, 52.82%)",
            },
            "800": {
              value: "hsl(352, 91%, 71.5%)",
            },
            "900": {
              value: "hsl(352, 90.5%, 85.53%)",
            },
            "950": {
              value: "hsl(352, 90%, 90%)",
            },
          },
        },
        yellow: {
          light: {
            "50": {
              value: "hsl(38, 90%, 90%)",
            },
            "100": {
              value: "hsl(38, 90.5%, 85.53%)",
            },
            "200": {
              value: "hsl(38, 91%, 71.5%)",
            },
            "300": {
              value: "hsl(38, 91.5%, 52.82%)",
            },
            "400": {
              value: "hsl(38, 92%, 38.82%)",
            },
            "500": {
              value: "hsl(38, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(38, 93%, 21.49%)",
            },
            "700": {
              value: "hsl(38, 93.5%, 15.81%)",
            },
            "800": {
              value: "hsl(38, 94%, 11.35%)",
            },
            "900": {
              value: "hsl(38, 94.5%, 7.81%)",
            },
            "950": {
              value: "hsl(38, 95%, 5%)",
            },
          },
          dark: {
            "50": {
              value: "hsl(38, 95%, 5%)",
            },
            "100": {
              value: "hsl(38, 94.5%, 7.81%)",
            },
            "200": {
              value: "hsl(38, 94%, 11.35%)",
            },
            "300": {
              value: "hsl(38, 93.5%, 15.81%)",
            },
            "400": {
              value: "hsl(38, 93%, 21.49%)",
            },
            "500": {
              value: "hsl(38, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(38, 92%, 38.82%)",
            },
            "700": {
              value: "hsl(38, 91.5%, 52.82%)",
            },
            "800": {
              value: "hsl(38, 91%, 71.5%)",
            },
            "900": {
              value: "hsl(38, 90.5%, 85.53%)",
            },
            "950": {
              value: "hsl(38, 90%, 90%)",
            },
          },
        },
        green: {
          light: {
            "50": {
              value: "hsl(135, 90%, 90%)",
            },
            "100": {
              value: "hsl(135, 90.5%, 85.53%)",
            },
            "200": {
              value: "hsl(135, 91%, 71.5%)",
            },
            "300": {
              value: "hsl(135, 91.5%, 52.82%)",
            },
            "400": {
              value: "hsl(135, 92%, 38.82%)",
            },
            "500": {
              value: "hsl(135, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(135, 93%, 21.49%)",
            },
            "700": {
              value: "hsl(135, 93.5%, 15.81%)",
            },
            "800": {
              value: "hsl(135, 94%, 11.35%)",
            },
            "900": {
              value: "hsl(135, 94.5%, 7.81%)",
            },
            "950": {
              value: "hsl(135, 95%, 5%)",
            },
          },
          dark: {
            "50": {
              value: "hsl(135, 95%, 5%)",
            },
            "100": {
              value: "hsl(135, 94.5%, 7.81%)",
            },
            "200": {
              value: "hsl(135, 94%, 11.35%)",
            },
            "300": {
              value: "hsl(135, 93.5%, 15.81%)",
            },
            "400": {
              value: "hsl(135, 93%, 21.49%)",
            },
            "500": {
              value: "hsl(135, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(135, 92%, 38.82%)",
            },
            "700": {
              value: "hsl(135, 91.5%, 52.82%)",
            },
            "800": {
              value: "hsl(135, 91%, 71.5%)",
            },
            "900": {
              value: "hsl(135, 90.5%, 85.53%)",
            },
            "950": {
              value: "hsl(135, 90%, 90%)",
            },
          },
        },
        teal: {
          light: {
            "50": {
              value: "hsl(172, 90%, 90%)",
            },
            "100": {
              value: "hsl(172, 90.5%, 85.53%)",
            },
            "200": {
              value: "hsl(172, 91%, 71.5%)",
            },
            "300": {
              value: "hsl(172, 91.5%, 52.82%)",
            },
            "400": {
              value: "hsl(172, 92%, 38.82%)",
            },
            "500": {
              value: "hsl(172, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(172, 93%, 21.49%)",
            },
            "700": {
              value: "hsl(172, 93.5%, 15.81%)",
            },
            "800": {
              value: "hsl(172, 94%, 11.35%)",
            },
            "900": {
              value: "hsl(172, 94.5%, 7.81%)",
            },
            "950": {
              value: "hsl(172, 95%, 5%)",
            },
          },
          dark: {
            "50": {
              value: "hsl(172, 95%, 5%)",
            },
            "100": {
              value: "hsl(172, 94.5%, 7.81%)",
            },
            "200": {
              value: "hsl(172, 94%, 11.35%)",
            },
            "300": {
              value: "hsl(172, 93.5%, 15.81%)",
            },
            "400": {
              value: "hsl(172, 93%, 21.49%)",
            },
            "500": {
              value: "hsl(172, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(172, 92%, 38.82%)",
            },
            "700": {
              value: "hsl(172, 91.5%, 52.82%)",
            },
            "800": {
              value: "hsl(172, 91%, 71.5%)",
            },
            "900": {
              value: "hsl(172, 90.5%, 85.53%)",
            },
            "950": {
              value: "hsl(172, 90%, 90%)",
            },
          },
        },
        purple: {
          light: {
            "50": {
              value: "hsl(279, 90%, 90%)",
            },
            "100": {
              value: "hsl(279, 90.5%, 85.53%)",
            },
            "200": {
              value: "hsl(279, 91%, 71.5%)",
            },
            "300": {
              value: "hsl(279, 91.5%, 52.82%)",
            },
            "400": {
              value: "hsl(279, 92%, 38.82%)",
            },
            "500": {
              value: "hsl(279, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(279, 93%, 21.49%)",
            },
            "700": {
              value: "hsl(279, 93.5%, 15.81%)",
            },
            "800": {
              value: "hsl(279, 94%, 11.35%)",
            },
            "900": {
              value: "hsl(279, 94.5%, 7.81%)",
            },
            "950": {
              value: "hsl(279, 95%, 5%)",
            },
          },
          dark: {
            "50": {
              value: "hsl(279, 95%, 5%)",
            },
            "100": {
              value: "hsl(279, 94.5%, 7.81%)",
            },
            "200": {
              value: "hsl(279, 94%, 11.35%)",
            },
            "300": {
              value: "hsl(279, 93.5%, 15.81%)",
            },
            "400": {
              value: "hsl(279, 93%, 21.49%)",
            },
            "500": {
              value: "hsl(279, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(279, 92%, 38.82%)",
            },
            "700": {
              value: "hsl(279, 91.5%, 52.82%)",
            },
            "800": {
              value: "hsl(279, 91%, 71.5%)",
            },
            "900": {
              value: "hsl(279, 90.5%, 85.53%)",
            },
            "950": {
              value: "hsl(279, 90%, 90%)",
            },
          },
        },
        pink: {
          light: {
            "50": {
              value: "hsl(335, 90%, 90%)",
            },
            "100": {
              value: "hsl(335, 90.5%, 85.53%)",
            },
            "200": {
              value: "hsl(335, 91%, 71.5%)",
            },
            "300": {
              value: "hsl(335, 91.5%, 52.82%)",
            },
            "400": {
              value: "hsl(335, 92%, 38.82%)",
            },
            "500": {
              value: "hsl(335, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(335, 93%, 21.49%)",
            },
            "700": {
              value: "hsl(335, 93.5%, 15.81%)",
            },
            "800": {
              value: "hsl(335, 94%, 11.35%)",
            },
            "900": {
              value: "hsl(335, 94.5%, 7.81%)",
            },
            "950": {
              value: "hsl(335, 95%, 5%)",
            },
          },
          dark: {
            "50": {
              value: "hsl(335, 95%, 5%)",
            },
            "100": {
              value: "hsl(335, 94.5%, 7.81%)",
            },
            "200": {
              value: "hsl(335, 94%, 11.35%)",
            },
            "300": {
              value: "hsl(335, 93.5%, 15.81%)",
            },
            "400": {
              value: "hsl(335, 93%, 21.49%)",
            },
            "500": {
              value: "hsl(335, 92.5%, 28.88%)",
            },
            "600": {
              value: "hsl(335, 92%, 38.82%)",
            },
            "700": {
              value: "hsl(335, 91.5%, 52.82%)",
            },
            "800": {
              value: "hsl(335, 91%, 71.5%)",
            },
            "900": {
              value: "hsl(335, 90.5%, 85.53%)",
            },
            "950": {
              value: "hsl(335, 90%, 90%)",
            },
          },
        },
        gray: {
          "50": { value: "hsl(0, 0%, 97%)" },
          "100": { value: "hsl(0, 0%, 95%)" },
          "200": { value: "hsl(0, 0%, 70.63%)" },
          "300": { value: "hsl(0, 0%, 51.07%)" },
          "400": { value: "hsl(0, 0%, 36.42%)" },
          "500": { value: "hsl(0, 0%, 26%)" },
          "600": { value: "hsl(0, 0%, 18.26%)" },
          "700": { value: "hsl(0, 0%, 12.32%)" },
          "800": { value: "hsl(0, 0%, 7.65%)" },
          "900": { value: "hsl(0, 0%, 3.94%)" },
          "950": { value: "hsl(0, 0%, 2.5%)" },
        },
      },
      fontSizes: {
        xlg: { value: "18px" },
        xxlg: { value: "22px" },
        xxxlg: { value: "26px" },
        lg: { value: "larger" },
        md: { value: "medium" },
        sm: { value: "small" },
      },
      borders: {
        container: { value: "0.1px solid #424242" },
        selected: { value: "1px solid" },
        secondary: { value: "rgb(0, 153, 255)" },
        success: { value: "#5cb85c" },
      },
      gradients: {
        primary: {
          value:
            "linear-gradient(315deg, rgb(0, 153, 255) 0%, rgb(0, 204, 255) 100%)",
        },
      },
      spacing: {
        sm: { value: "4px" },
        md: { value: "6px" },
        lg: { value: "12px" },
        xlg: { value: "18px" },
        xxlg: { value: "22px" },
        xxxlg: { value: "26px" },
      },
      radii: {
        sm: { value: "8px" },
        md: { value: "6px" },
        lg: { value: "8px" },
      },
      fontWeights: {
        bold: { value: "bold" },
        normal: { value: "normal" },
        lighter: { value: "lighter" },
      },
    },

    /** ✅ Colores para Dark / Light */
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { base: "{colors.gray.50}", _dark: "{colors.gray.950}" }, // Fondo principal
          },
          muted: {
            value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" }, // Para secciones secundarias
          },
          elevated: {
            value: { base: "{colors.gray.50}", _dark: "{colors.gray.700}" }, // Para cards, modales, etc.
          },
          subtle: {
            value: { base: "{colors.gray.200}", _dark: "{colors.gray.600}" }, // Contenedores suaves
          },
          accent: {
            value: {
              base: "{colors.blue.light.50}",
              _dark: "{colors.blue.dark.700}",
            }, // Para resaltar contenedores
          },
        },

        // Text
        text: {
          DEFAULT: { value: { base: "black", _dark: "white" } },
          muted: {
            value: { base: "{colors.gray.600}", _dark: "{colors.gray.300}" },
          },
          subtle: {
            value: { base: "{colors.gray.500}", _dark: "{colors.gray.400}" },
          },
        },

        // Primary & Secondary Variants
        primary: {
          DEFAULT: {
            value: { base: "#4B5EFC", _dark: "#4B5EFC" },
          },
          hover: {
            value: { base: "rgb(0, 130, 220)", _dark: "rgb(0, 180, 220)" },
          },
        },
        secondary: {
          DEFAULT: { value: { base: "#6b7280", _dark: "#9ca3af" } },
          hover: { value: { base: "#4b5563", _dark: "#d1d5db" } },
        },

        // Status Colors
        success: { value: { base: "#5cb85c", _dark: "#4ade80" } },
        danger: { value: { base: "#bb2124", _dark: "#ef4444" } },
        warning: { value: { base: "#f59e0b", _dark: "#fbbf24" } },

        // Accent (por si quieres un color resaltante adicional)
        accent: { value: { base: "#6366f1", _dark: "#818cf8" } },

        // Borders
        border: {
          DEFAULT: {
            value: { base: "{colors.gray.100}", _dark: "{colors.gray.700}" },
          },
          muted: {
            value: { base: "{colors.gray.200}", _dark: "{colors.gray.600}" },
          },
          elevated: {
            value: { base: "{colors.gray.300}", _dark: "{colors.gray.500}" },
          },
          subtle: {
            value: { base: "{colors.gray.200}", _dark: "{colors.gray.600}" },
          },
          accent: {
            value: {
              base: "{colors.blue.light.300}",
              _dark: "{colors.blue.dark.400}",
            },
          },
          focus: {
            value: { base: "rgb(0,153,255)", _dark: "rgb(0,204,255)" },
          },
        },
      },
    },
  },

  outdir: "styled-system",
});
