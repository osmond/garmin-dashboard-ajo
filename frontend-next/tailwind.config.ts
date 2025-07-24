import type { Config } from 'tailwindcss'

const { themes } = require('ui')

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...themes.zinc.colors,
      },
    },
  },
  plugins: [require('ui/plugin')({ themes: ['zinc'] })],
}

export default config
