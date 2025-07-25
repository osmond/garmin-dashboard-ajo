// make `require('ui')` succeed for any code that still tries to pull in themes
module.exports = {
  themes: {
    zinc: { colors: require('tailwindcss/colors').zinc }
  }
};
