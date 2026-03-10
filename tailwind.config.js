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
          50: '#f6f8f6',
          100: '#edf1ed',
          200: '#d1dcd1',
          300: '#b5c7b5',
          400: '#7da17b',
          500: '#4b7049', // Even Lighter Forest Green
          600: '#41613f',
          700: '#375235',
          800: '#2d432b',
          900: '#233421',
        },
        secondary: {
          500: '#9ba38f', // Lighter Sage
          600: '#89917d',
        },
        accent: {
          400: '#d5dbbf',
          500: '#c4ccaa', // Lighter Olive
          600: '#b2ba96',
        },
        dark: {
          bg: '#253124', // Lighter Deep Forest
          card: '#2f3d2e',
          border: '#415140',
        },
        ivory: '#faf9f6',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Noto Sans TC', 'sans-serif'],
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
