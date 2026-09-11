import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // eslint-config-next resolves its bundled plugins relative to the project cwd.
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "tsconfig.tsbuildinfo"],
  },
];

export default eslintConfig;
