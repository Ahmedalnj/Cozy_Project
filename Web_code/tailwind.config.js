/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0077B6",
        secondary: "#00B4D8",
        lightBlue: "#90E0EF",
        backgroundBlue: "#F1FAFE",
        darkText: "#03045E",
        warmBeige: "#F5F5DC",
        accent: "#FFBA76",
        neutralGray: "#6B7280",
      },
      fontFamily: {
        'dubai': ['Dubai', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
