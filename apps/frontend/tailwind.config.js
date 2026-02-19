/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Blue from design
          hover: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#F3F4F6',
          dark: '#111827', // Footer background
        },
        border: '#E5E7EB',
      },
      borderRadius: {
        'xl': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}