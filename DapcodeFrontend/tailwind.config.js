/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          canvas: '#FDFBF7',
          surface: '#FFFFFF',
          subtle: '#FAF8F3',
          border: '#E8E4DC',
          'border-subtle': '#EFECE6',
          text: '#1C1917',
          'text-muted': '#78716C',
          accent: '#2D2A26',
          'dark-canvas': '#141312',
          'dark-surface': '#1C1A18',
          'dark-subtle': '#24221F',
          'dark-border': '#332F2B',
          'dark-text': '#F5F2EB',
          'dark-text-muted': '#A8A29E',
        },
        earth: {
          green: '#15803D',
          'green-bg': '#F0FDF4',
          'green-border': '#BBF7D0',
          red: '#B91C1C',
          'red-bg': '#FEF2F2',
          'red-border': '#FECACA',
          olive: '#44403C',
          charcoal: '#1C1917',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
