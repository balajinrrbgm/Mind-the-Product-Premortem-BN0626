/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0c0a09',
          soft: '#1c1917',
          muted: '#44403c',
        },
        paper: {
          DEFAULT: '#faf8f5',
          card: '#ffffff',
          line: '#ece8e1',
        },
        ember: {
          50: '#fff5ed',
          100: '#ffe9d5',
          200: '#fecfaa',
          300: '#fdac74',
          400: '#fb7e3c',
          500: '#f95816',
          600: '#ea3d0c',
          700: '#c22c0c',
          800: '#9a2512',
          900: '#7c2112',
        },
        sage: {
          50: '#f1f8f4',
          100: '#ddeee3',
          200: '#bdddca',
          300: '#90c3a7',
          400: '#5fa37f',
          500: '#3d8463',
          600: '#2c6a4e',
          700: '#235440',
          800: '#1e4334',
          900: '#19372c',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(12,10,9,0.04), 0 8px 24px -12px rgba(12,10,9,0.12)',
        lift: '0 2px 4px rgba(12,10,9,0.05), 0 20px 40px -16px rgba(12,10,9,0.22)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'pop': 'pop 0.3s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
