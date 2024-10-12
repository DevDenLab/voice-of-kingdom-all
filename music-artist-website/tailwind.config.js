/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,js}"],
  theme: {
    container:{
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1500px',
        '2xl': '1600px',
      },
    },
    extend: {},
  },
  plugins: [],
}