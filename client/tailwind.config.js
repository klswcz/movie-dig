module.exports = {
  purge: ['./src/components/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        '3xl': '1900px',
        '4xl': '2200px'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
