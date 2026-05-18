/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
       animation: {
    borderMove: "borderMove 4s linear infinite",
  },
  keyframes: {
    borderMove: {
      "0%": { backgroundPosition: "0% 50%" },
      "100%": { backgroundPosition: "200% 50%" },
    },
  },
    },
  },
  plugins: [],
}
