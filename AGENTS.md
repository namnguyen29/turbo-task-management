# Repository Guidelines

## Project Structure & Module Organization

This pnpm/Turborepo workspace contains two applications and shared packages:

- `apps/web/`: Angular frontend. Application code lives in `src/app/`; styles and static files are in `src/` and `public/`.
- `apps/api/`: NestJS backend. Organize domain work under `src/features/<feature>/`; keep DTOs in a feature's `dto/` directory and shared error handling in `src/common/`.
- `packages/types/`: shared TypeScript contracts, currently organized by domain (for example, `src/task/`).
- `packages/typescript-config/` and `packages/eslint-config/`: reusable tooling configuration.
- `tickets/`: implementation notes and task specifications; treat these as useful context when changing the related feature.

## Build, Test, and Development Commands

Use Node 20.19+ and pnpm 11.

- `pnpm dev`: run development tasks across the workspace through Turbo.
- `pnpm build`: build every workspace package and application.
- `pnpm lint`: run configured lint tasks across the workspace.
- `pnpm check-types`: run workspace type-check tasks where available.
- `pnpm --filter api test`: run NestJS/Jest unit tests.
- `pnpm --filter api test:e2e`: run API end-to-end tests.
- `pnpm --filter web test`: run Angular's Jasmine/Karma test suite.

For focused local work, use `pnpm --filter web dev` or `pnpm --filter api dev`.

## Coding Style & Naming Conventions

Write TypeScript throughout. Follow Prettier formatting: the web app uses single quotes and 100-column wrapping; the API ESLint/Prettier configuration enforces up to 120 columns. Run `pnpm format` for Markdown and TypeScript formatting. Use kebab-case for files and folders (`create-task.dto.ts`, `home-page/`), PascalCase for classes and interfaces, and camelCase for values. Keep Angular component files paired as `.ts`, `.html`, `.scss`, and `.spec.ts`.

## Testing Guidelines

Place unit tests beside the implementation as `*.spec.ts`. API tests use Jest and `@nestjs/testing`; browser tests use Jasmine/Karma. Cover success paths, validation failures, and error responses when changing API behavior. Run the relevant app test command before submitting; use `pnpm --filter api test:cov` when checking backend coverage. No repository-wide coverage threshold is currently configured.

## Commit & Pull Request Guidelines

Recent history uses concise, lowercase Conventional Commit-style subjects, such as `feature: add task package` and `feature: add task crud apis (#2)`. Use that pattern and keep each commit focused. Pull requests should explain the user-visible or API impact, link the relevant issue or ticket, list validation commands run, and include screenshots for web UI changes. Note migrations, configuration changes, or follow-up work explicitly.
