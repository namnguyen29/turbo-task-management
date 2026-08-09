# Repository Guidelines

## Project Structure & Module Organization

This pnpm/Turborepo workspace contains two applications and shared packages:

- `apps/web/` is the Angular frontend: pages in `src/app/pages/`, layouts in `layouts/`, API clients in `apis/`, and shared services in `shared/`.
- `apps/api/` is the NestJS backend. Keep feature code under `src/features/<feature>/`; shared errors and configuration are in `src/common/` and `src/config/`.
- `packages/types/` exports cross-application TypeScript contracts. `packages/eslint-config/` and `packages/typescript-config/` centralize tooling configuration.
- API end-to-end tests are in `apps/api/test/`; unit tests sit next to source files as `*.spec.ts`.

## Build, Test, and Development Commands

Use Node 20.19+ and pnpm 11.

- `pnpm dev` starts all workspace development tasks through Turborepo.
- `pnpm --filter web dev` or `pnpm --filter api dev` starts one application.
- `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm check-types` run the corresponding task across the workspace.
- `pnpm test:e2e` runs E2E tasks; use `pnpm --filter api test:e2e` for the API suite.
- `pnpm format` applies root Prettier formatting to TypeScript, TSX, and Markdown files.

## Coding Style & Naming Conventions

Write TypeScript, formatted with Prettier (100-column width and single quotes in the web app). Use ESLint before submitting changes. Use lower-kebab directory names, such as `home-page` and `welcome-modal`, and role-based files (`task.service.ts`, `create-task.dto.ts`). Keep Angular templates and styles beside their component `.ts` file. Organize API code into feature modules, controllers, services, and DTOs.

## Testing Guidelines

Angular tests use Jasmine/Karma and API tests use Jest; both expect `*.spec.ts`. Add or update focused unit tests with behavior changes. Run `pnpm --filter web test` for headless frontend tests and `pnpm --filter api test` for backend unit tests. Run API E2E tests when changing endpoints, validation, or server configuration. No coverage threshold is configured; retain meaningful coverage for changed paths.

## Commit & Pull Request Guidelines

Recent commits use concise imperative Conventional-Commit-style subjects, for example `feat: add web modal service`. Keep commits focused and include the affected area when helpful. Pull requests should explain the change and validation performed, link the relevant issue when applicable, and include screenshots for visible web UI changes. Ensure linting, tests, type checks, and build pass before review.

## Configuration & Security

Do not commit credentials or `.env` files. The API validates environment configuration at startup; document required variables and provide safe development defaults. Remote Turborepo caching uses `TURBO_TOKEN` and `TURBO_TEAM` CI secrets.