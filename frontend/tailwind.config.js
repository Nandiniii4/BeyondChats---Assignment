/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0f172a', 
        'brand-card': 'rgba(30, 41, 59, 0.7)', 
        'brand-primary': '#8b5cf6', 
        'brand-cyan': '#06b6d4', 
      }
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["dark"],
  },
}

