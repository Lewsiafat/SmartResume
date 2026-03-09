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
          50: '#f4f6f4',
          100: '#e8ece8',
          200: '#c6cfc6',
          300: '#a4b1a4',
          400: '#61765f',
          500: '#3a5c38', // Lighter Forest Green
          600: '#325031',
          700: '#2a4329',
          800: '#223621',
          900: '#1a2919',
        },
        secondary: {
          500: '#8c9480', // Lighter Sage
          600: '#7a826e',
        },
        accent: {
          400: '#c6ccae',
          500: '#b4bc94', // Lighter Olive
          600: '#a0a882',
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
