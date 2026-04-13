/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ed',
          100: '#fdecd5',
          200: '#fad5aa',
          300: '#f6b86d',
          400: '#f4a261', // Coral
          500: '#e76f51', // Burnt Orange
          600: '#d45a3a',
          700: '#b04428',
          800: '#8d371f',
          900: '#743018',
        },
        secondary: {
          500: '#c1666b', // Terracotta
          600: '#a85459',
        },
        accent: {
          400: '#f4c97e',
          500: '#e9c46a', // Warm Sand
          600: '#d4b05a',
        },
        dark: {
          bg: '#264653', // Deep Teal
          card: '#2d5460',
          border: '#3a6b78',
        },
        ivory: '#fef9f4', // Warm White
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
