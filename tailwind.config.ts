import type { Config } from "tailwindcss";

export default {
  content: ["./client/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "Inter-fallback",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Oswald",
          "Oswald-fallback",
          "Impact",
          "Arial Black",
          "sans-serif",
        ],
      },
      // Sistema de 4 cores padrão
      colors: {
        // 1. Preto - backgrounds, overlay
        dark: "#000000",
        
        // 2. Branco - texto principal, elementos claros
        light: "#ffffff",
        
        // 3. Laranja - accent, CTAs, marca
        accent: "#ff6b35",
        
        // 4. Cinza - texto secundário, elementos muted
        muted: "#6b7280",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      letterSpacing: {
        "extra-wide": "0.2em",
        "super-wide": "0.3em",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
