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
  colors = {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: 'var(--card)',
    'card-foreground': 'var(--card-foreground)',
    popover: 'var(--popover)',
    'popover-foreground': 'var(--popover-foreground)',
    primary: 'var(--primary)',
    'primary-foreground': 'var(--primary-foreground)',
    secondary: 'var(--secondary)',
    'secondary-foreground': 'var(--secondary-foreground)',
    muted: 'var(--muted)',
    'muted-foreground': 'var(--muted-foreground)',
    accent: 'var(--accent)',
    'accent-foreground': 'var(--accent-foreground)',
    destructive: 'var(--destructive)',
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
  };
}

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: { colors },
  },
  plugins,
};
