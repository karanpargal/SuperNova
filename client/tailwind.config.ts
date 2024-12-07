import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      fontFamily: {
        "space-grotesk": ["var(--font-space-grotesk)"],
      },
      colors: {
        app: {
          "dark-purple": "#361a36",
          pink: "#fc72ff",
          night: "#131313",
          eerie: "#1b1b1b",
          jet: "#303030",
          gray: "#9a9a9a",
          blue: "#3f5cea",
          secondary: "#111821",
          gunmetal: "#1d2a3a",
          crimson: "#dd1437",
        },
      },
      animation: {
        sparkle: "sparkle 3s ease-in-out  0.5s 1",
        "move-lines": "move-lines 3s linear infinite",
        float: "float 5s  ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "50%": {
            transform: "translateY(-30px) ",
            opacity: "0.8",
          },
          "100%": {
            transform: "translateY(-60px)",
            opacity: "0.5",
          },
        },
        "move-lines": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "50%": {
            transform: "translateX(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
        },

        sparkle: {
          "0%": {
            textShadow:
              "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff",
          },
          "50%": {
            textShadow:
              "0 0 10px #fff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
