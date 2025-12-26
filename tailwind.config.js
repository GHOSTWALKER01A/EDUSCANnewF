
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "var(--accent)",
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        cardBg: "var(--card-bg)",
        textSecondary: "var(--text-secondary)",
      },
      animation: {
        'spin-slow': 'spin 22s linear infinite',
      }
    },
  },
  plugins: [],
}
