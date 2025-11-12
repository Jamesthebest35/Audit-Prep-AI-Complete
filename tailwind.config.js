/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./types.ts",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'accent': '#10b981',
        'accent-hover': '#059669',
        'brand-primary': '#1E40AF',
        'brand-secondary': '#1D4ED8',
        'brand-light': '#3B82F6',
        'brand-surface': '#EFF6FF',
        'status-green': '#16A34A',
        'status-yellow': '#F59E0B',
        'status-red': '#DC2626',
        'gray-light': '#F9FAFB',
        'gray-medium': '#6B7280',
        'gray-dark': '#1F2937',
        'gray-border': '#E5E7EB',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
