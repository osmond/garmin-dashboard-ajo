/** @type {import('tailwindcss').Config} */
let colors = {};
const plugins = [];
try {
  const { themes } = require('ui');
  colors = themes.zinc.colors;
  const uiPlugin = require('ui/plugin');
  plugins.push(uiPlugin({ themes: ['zinc'] }));
} catch (e) {
  // ui package not available; fall back to default
}

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
  plugins,
};
