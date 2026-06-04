import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  /* Project-wide rule tightening. Catches the most common LLM /
     vibe-coding anti-patterns at the lint stage instead of waiting
     for them to bite in prod. Adjust here if any rule turns out to
     be too noisy. */
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      /* No silent escape hatches via `any`. Forces explicit unknown +
         narrow, or a proper type. The handful of legitimate cases
         (Leaflet's dynamic import, etc.) already have inline
         eslint-disable comments. */
      "@typescript-eslint/no-explicit-any": "error",
      /* Hooks with missing deps are the source of most React 19
         strict-mode bugs we've shipped. Promote from warn → error. */
      "react-hooks/exhaustive-deps": "error",
    },
  },
]);

export default eslintConfig;
