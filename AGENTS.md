# Repository Guidelines

## Project Structure & Module Organization

This pnpm workspace is managed by Turborepo. Application code lives in `apps/`:

- `apps/web/` and `apps/docs/` are Next.js App Router applications. Routes, layouts, and styles belong in each app's `app/` directory; static files belong in `public/`.
- `packages/ui/` contains shared React components. Import them through package exports, for example `@repo/ui/button`.
- `packages/eslint-config/` and `packages/typescript-config/` centralize lint and TypeScript settings. Change these deliberately because they affect every workspace.

Keep app-specific code in its app and promote components to `@repo/ui` only when they are genuinely reusable.

## Build, Test, and Development Commands

Use Node.js 18+ and pnpm 9 (as declared in `package.json`). From the repository root:

- `pnpm install` installs workspace dependencies.
- `pnpm dev` starts development tasks across workspaces; use `pnpm --filter web dev` for only the web app (port 3000).
- `pnpm build` builds all packages and apps in dependency order.
- `pnpm lint` runs ESLint with warnings treated as failures.
- `pnpm check-types` runs framework type generation and TypeScript checks.
- `pnpm format` applies Prettier to `*.ts`, `*.tsx`, and `*.md` files.

Run `pnpm lint` and `pnpm check-types` before opening a pull request; run `pnpm build` when changing build, configuration, or cross-package code.

## Coding Style & Naming Conventions

Write TypeScript and React function components. Follow Prettier's output (two-space indentation, semicolons, and double quotes) rather than manually aligning code. Use PascalCase for React components and their files (for example `Button` in `button.tsx` follows the existing export convention), camelCase for variables/functions, and `*.module.css` for component-scoped styles. Prefer `type` for simple aliases and keep prop interfaces close to their components.

## Testing Guidelines

No automated test runner or coverage threshold is currently configured. For every change, run linting and type checks, and manually verify the affected app with `pnpm --filter <app> dev`. If adding tests, colocate them with the relevant feature and add the runner and its command to the root scripts and this guide.

## Commit & Pull Request Guidelines

History currently contains only short `first commit` messages, so no established convention exists. Use concise, imperative subjects such as `Add task status filter`; keep commits focused. Pull requests should explain the change and verification performed, link related issues when available, and include screenshots or recordings for visible UI changes.
