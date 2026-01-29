/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#13ec80',
        'accent-coral': '#ff6b6b',
        'background-light': '#f8fdfb',
        'surface-card': 'rgba(255, 255, 255, 0.8)',
      },
      fontFamily: {
        display: ['Quicksand', 'Noto Sans SC', 'sans-serif'],
        cute: ['ZCOOL KuaiLe', 'Noto Sans SC', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        lg: '1.25rem',
        xl: '1.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
