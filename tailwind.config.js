/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        accent: {
          DEFAULT: '#1DB954',
          light: '#1ED760',
          dark: '#169c46',
        },
        base: {
          black: '#000000',
          bg: '#0a0a0a',
          surface: '#121212',
          elevated: '#181818',
          highlight: '#282828',
          border: '#2a2a2a',
        },
        light: {
          bg: '#fafafa',
          surface: '#ffffff',
          elevated: '#f3f3f3',
          highlight: '#e8e8e8',
          border: '#e0e0e0',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'fade-surface': 'linear-gradient(180deg, rgba(29,185,84,0.15) 0%, rgba(18,18,18,0) 60%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'slide-up': 'slideUp 0.35s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Adds a `light:` variant (mirrors the built-in `dark:` one) so both
    // themes can be expressed as explicit, readable utility classes.
    function ({ addVariant }) {
      addVariant('light', '.light &')
    },
  ],
}
