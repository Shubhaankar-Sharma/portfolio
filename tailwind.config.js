/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-text': '#333333',
        'link': '#5F9EA0',
        'landing-bg': '#DED9C8',
        'universal-bg': '#EAEAE9',
        'secondary-text': 'rgba(0, 0, 0, 0.61)',
      },
      fontSize: {
        'landing-main': '36px',
        'footer': '24px',
        'h1': '48px',
        'h2': '36px',
        'body': '28px',
      },
      fontFamily: {
        'vt323': ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}