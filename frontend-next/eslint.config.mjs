import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tailwind from "eslint-plugin-tailwindcss";
import tailwindConfig from "./tailwind.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure Tailwind config and plugins resolve relative to this directory
process.chdir(__dirname);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:tailwindcss/recommended"
  ),
  {
    plugins: {
      tailwind,
    },
    settings: {
      tailwindcss: {
        config: tailwindConfig,
      },
    },
  },
];

export default eslintConfig;
