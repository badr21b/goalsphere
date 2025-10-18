/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'Arial', 'sans-serif'],
      },
      colors: {
        // Premier League inspired colors
        'pl-purple': '#37003C',
        'pl-gold': '#FFD700',
        'pl-white': '#FFFFFF',
        'pl-dark': '#1A1A1A',
        'pl-gray': '#2D2D2D',
        'pl-light-gray': '#4A4A4A',
        'pl-accent': '#00D4AA',
        'pl-red': '#E53E3E',
        'pl-blue': '#3182CE',
        // Legacy colors for compatibility
        'sport-red': '#E53E3E',
        'sport-gold': '#FFD700',
        'sport-green': '#00D4AA',
        'sport-dark': '#1A1A1A',
        'sport-gray': '#2D2D2D',
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
