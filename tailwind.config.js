/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          50: "#18181b",
          100: "#27272a",
          900: "#09090b",
        },
      },
      boxShadow: {
        cell: "0 2px 8px -2px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
