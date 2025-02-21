import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-gray": "var(--input)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        doodle: "url('/doodles2.jpg')"
      }
    },
  },
  plugins: [],
} satisfies Config;
