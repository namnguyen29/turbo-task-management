import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import angularPlugin from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import angularTemplateParser from "@angular-eslint/template-parser";

/**
 * A custom ESLint configuration for Angular applications.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const angularConfig = [
  {
    ignores: ["dist/**", ".angular/**", "coverage/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts"],
  })),
  {
    files: ["**/*.ts"],
    plugins: {
      "@angular-eslint": angularPlugin,
    },
    processor: angularTemplate.processors["extract-inline-html"],
    rules: {
      ...angularPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      ...angularTemplate.configs.accessibility.rules,
      "@angular-eslint/template/interactive-supports-focus": "warn",
    },
  },
];
