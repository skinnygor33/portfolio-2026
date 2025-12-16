/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        'paper': '#F2F0E9',
        'ink': '#2A2A2A',
        'bruise': '#5C4B4B',
        'velvet': '#722F37',
      },
    },
  },
  plugins: [],
}