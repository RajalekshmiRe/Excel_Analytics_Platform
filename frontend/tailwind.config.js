/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables dark mode toggling via class on <html> or <body>
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // adjust paths as per your project
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}