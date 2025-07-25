import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable some strict rules for hackathon development
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off", // Allow any for Google Maps API
      "@typescript-eslint/no-empty-object-type": "off",
      "@next/next/no-img-element": "warn", // Warn instead of error
      "jsx-a11y/alt-text": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
    ignores: ["node_modules/**", ".next/**", "out/**"],
  },
];

export default eslintConfig;
