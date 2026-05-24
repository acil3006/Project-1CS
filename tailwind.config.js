/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9fb',
          100: '#d6f1f6',
          200: '#b1e4ee',
          300: '#7fd3e2',
          400: '#47bbd2',
          500: '#249fb8',
          600: '#197f97',
          700: '#166578',
          800: '#155465',
          900: '#134556',
        },
        accent: {
          50: '#f5f9ff',
          100: '#e6f0ff',
          200: '#c6dcff',
          300: '#98beff',
          400: '#6698ff',
          500: '#3f74ff',
          600: '#2c54e6',
          700: '#2342b7',
          800: '#1f3791',
          900: '#1c2f73',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 30px -18px rgba(15, 23, 42, 0.4)',
      },
    },
  },
  plugins: [],
}
