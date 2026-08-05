// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Creates the shared ESLint configuration for NestJS applications.
 *
 * @param {string} tsconfigRootDir Absolute path to the consuming application's tsconfig directory.
 * @returns {import("eslint").Linter.Config[]}
 */
export function nestjsConfig(tsconfigRootDir) {
  return [
    {
      ignores: ["eslint.config.mjs"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: "commonjs",
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    {
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
      },
    },
  ];
}
