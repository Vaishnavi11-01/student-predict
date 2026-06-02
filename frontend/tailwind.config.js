/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.5)',
          border: 'rgba(255, 255, 255, 0.2)'
        },
        accent: {
          cyan: '#00D4FF',
          purple: '#7C3AED',
          green: '#10B981',
          red: '#EF4444',
          yellow: '#F59E0B'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
