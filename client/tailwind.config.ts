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
        },
      },
      animation: {
        sparkle: "sparkle 3s ease-in-out  0.5s 1",
      },
      keyframes: {
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
