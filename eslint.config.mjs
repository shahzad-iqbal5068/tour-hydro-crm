import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // ✅ Add rule overrides here
  {
    rules: {
      // Disable the "no setState in effect" rule
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;