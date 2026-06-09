import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          blush: '#c9a882',
          DEFAULT: '#6c402a',
          dark: '#3a4a31',
        },
        warm: {
          text: '#3a4a31',
          muted: '#737041',
          light: '#f8efdf',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
