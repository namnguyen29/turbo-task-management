# Repository Guidelines

## Project Structure & Module Organization

This pnpm 11 workspace is orchestrated with Turborepo. Application code is in `apps/`:

- `apps/api/` is the NestJS API. Source files are in `src/`; unit tests use `*.spec.ts` beside source files and end-to-end tests live in `test/`.
- `apps/web/` is the Angular client. Feature code belongs in `src/app/`, with page and layout files grouped by feature (for example, `pages/home-page/`). Global styles are in `src/styles.scss`.
- `apps/docs/` is the Next.js documentation app; routes and layouts are in `app/`, while static assets are in `public/`.
- `packages/ui/` contains shared React UI components, and `packages/eslint-config/` and `packages/typescript-config/` provide workspace-wide configuration.

Keep code application-specific until it is genuinely reusable. Use workspace imports such as `@repo/ui/button` for exported shared UI.

## Build, Test, and Development Commands

Run commands from the repository root:

- `pnpm install` installs all workspace dependencies (Node.js `>=20.19.0`).
- `pnpm dev` starts all development tasks; use `pnpm --filter api dev` or `pnpm --filter web dev` for one app.
- `pnpm build` builds workspace packages in dependency order.
- `pnpm lint` runs configured lint tasks, and `pnpm check-types` runs available type checks.
- `pnpm --filter api test` runs Nest unit tests; add `test:e2e` for API end-to-end tests. `pnpm --filter web test` runs Angular tests.
- `pnpm format` applies Prettier to TypeScript, TSX, and Markdown files.

## Coding Style & Naming Conventions

Use TypeScript and follow Prettier output: two-space indentation, semicolons, and double quotes unless an app-specific formatter configuration says otherwise. Use `camelCase` for functions and variables; use clear, feature-oriented folders. Angular components follow the existing `name.ts`, `name.html`, `name.scss`, and `name.spec.ts` pattern. Nest tests use `*.spec.ts`. Keep exported shared React components in the established lowercase package filenames, such as `packages/ui/src/button.tsx`.

## Testing Guidelines

Add or update tests with behavior changes. Keep Nest unit tests next to the implementation and API integration tests in `apps/api/test/`. Keep Angular specs next to their components/pages. No coverage threshold is configured; run the relevant test command, linting, and type checks before submitting changes.

## Commit & Pull Request Guidelines

Git history currently has only `first commit`, so use concise imperative subjects such as `Add task status filter`. Keep commits focused. Pull requests should explain the change, link related issues, list verification performed, and include screenshots or recordings for visible UI updates.
