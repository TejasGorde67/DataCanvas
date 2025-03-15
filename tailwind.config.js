/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          50: "#1a1a1a",
          100: "#121212",
          900: "#0a0a0a",
        },
      },
      boxShadow: {
        cell: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.300"),
            a: {
              color: theme("colors.blue.400"),
              "&:hover": {
                color: theme("colors.blue.300"),
              },
            },
            h1: {
              color: theme("colors.white"),
            },
            h2: {
              color: theme("colors.white"),
            },
            h3: {
              color: theme("colors.white"),
            },
            h4: {
              color: theme("colors.white"),
            },
            strong: {
              color: theme("colors.white"),
            },
            code: {
              color: theme("colors.gray.300"),
              backgroundColor: theme("colors.gray.800"),
              padding: "0.25rem",
              borderRadius: "0.25rem",
            },
            blockquote: {
              color: theme("colors.gray.400"),
              borderLeftColor: theme("colors.gray.700"),
            },
            hr: {
              borderColor: theme("colors.gray.700"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
