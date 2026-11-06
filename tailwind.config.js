/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070b12',
          900: '#0f172a',
          850: '#151f36',
          800: '#1e293b',
          700: '#334155',
          600: '#475569'
        },
        brand: {
          500: '#38bdf8',
          600: '#0284c7',
          700: '#0369a1'
        }
      }
    }
  },
  plugins: []
};
