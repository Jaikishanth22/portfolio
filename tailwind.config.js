/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.08)",
        background: "#05050A",
        foreground: "#F0F0EE",
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          foreground: "#8B94A3",
        },
      },
    },
  },
  plugins: [],
}
