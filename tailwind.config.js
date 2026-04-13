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
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Slate 500
          600: '#475569', // Slate 600
          700: '#334155', // Slate 700
          800: '#1e293b', // Slate 800
          900: '#0f172a', // Slate 900
        },
        secondary: {
          500: '#64748b', // Slate 500
          600: '#475569', // Slate 600
        },
        accent: {
          400: '#94a3b8', // Slate 400
          500: '#64748b', // Slate 500
          600: '#475569', // Slate 600
        },
        dark: {
          bg: '#0f172a', // Slate 900
          card: '#1e293b', // Slate 800
          border: '#334155', // Slate 700
        },
        ivory: '#f8fafc', // Slate 50
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
