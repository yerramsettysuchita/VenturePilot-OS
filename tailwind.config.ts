import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: "#00C9A7", light: "#E6FBF7" },
        purple: { DEFAULT: "#8B5CF6", light: "#F3EFFE" },
        amber: { DEFAULT: "#F59E0B", light: "#FFFBEB" },
        coral: { DEFAULT: "#F97316", light: "#FFF4EE" },
        ink: "#0A0A0F",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
