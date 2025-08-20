/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",      // All files in /pages
    "./components/**/*.{js,ts,jsx,tsx}", // All files in /components
    "./app/**/*.{js,ts,jsx,tsx}",        // If you’re using Next.js App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
