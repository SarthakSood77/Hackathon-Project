/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B1F51',
          'navy-dark': '#061333',
          'navy-light': '#14317a',
          'navy-muted': '#2c416e',
          gold: '#C59B27',
          'gold-light': '#FDF7E7',
          bg: '#F6F8FB',
          card: '#FFFFFF',
          border: '#D9E2EC',
          'border-dark': '#BCCCDC',
          muted: '#627D98',
          text: '#102A43',
          crimson: '#B3261E',
          'crimson-light': '#FDF0EE',
          emerald: '#1E7E48',
          'emerald-light': '#EEF7F2',
          amber: '#B4690E',
          'amber-light': '#FDF8EB',
        }
      },
      fontFamily: {
        serif: ['"PT Serif"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'gov': '0 2px 8px rgba(11, 31, 81, 0.05)',
        'gov-md': '0 4px 16px rgba(11, 31, 81, 0.08)',
        'gov-lg': '0 10px 30px rgba(11, 31, 81, 0.12)',
      }
    },
  },
  plugins: [],
}