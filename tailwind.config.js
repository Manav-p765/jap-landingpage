/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#0f0f0f',
        'ink-grey-dark': '#2b2b2b',
        'ink-grey': '#8c8c8c',
        'ink-grey-light': '#e5e5e5',
        'ink-red': '#d32f2f',
        'ink-white': '#fcfcfc',
      },
      fontFamily: {
        japanese: ['Mayashita', 'serif'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
