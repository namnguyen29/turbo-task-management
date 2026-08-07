# Ticket: Centralize API Environment Configuration

## Objective

Introduce a small, application-wide configuration setup for the NestJS API.

Today, `apps/api/src/main.ts` reads `process.env.PORT` directly. This works for a
single setting, but configuration will become difficult to find and validate as the
API gains settings such as database credentials, authentication secrets, and allowed
browser origins.

After this ticket, environment variables will be loaded in one place, validated when
the application starts, and accessed through Nest's `ConfigService`.

## Scope

This ticket covers only the API application's environment configuration.

- Add Nest's configuration package to `apps/api`.
- Load local values from an API-specific `.env` file.
- Define and validate the initial `NEST_PORT` and `NEST_NODE_ENV` settings.
- Replace direct `process.env` reads in `main.ts`.
- Provide a committed `.env.example` with safe defaults.

This ticket does not add a database, authentication, deployment secrets, or a shared
configuration package.

## Design

Use `@nestjs/config`'s `ConfigModule` as a global module. Configuration is
application infrastructure, rather than a business feature, so it should be imported
once by `AppModule` instead of being added to individual feature modules.

The module should load `apps/api/.env` for local development. Actual `.env` files
must stay out of version control; only `apps/api/.env.example` should be committed.

Use a validation function supplied to `ConfigModule.forRoot`. It keeps startup
validation explicit without introducing another dependency solely for two variables.
All API-owned environment variable names must start with `NEST_`, preventing them
from colliding with variables belonging to Node, infrastructure, or another
application in the monorepo. The validation should:

- default `NEST_NODE_ENV` to `development`;
- allow only `development`, `test`, and `production` for `NEST_NODE_ENV`;
- default `NEST_PORT` to `4300`;
- reject a `NEST_PORT` that is not an integer between `1` and `65535`.

Invalid settings must stop the application during bootstrap with a clear error. This
prevents the server from appearing to start with malformed configuration.

## Implementation Plan

### 1. Install the configuration dependency

Add `@nestjs/config` to `apps/api` dependencies:

```bash
pnpm --filter api add @nestjs/config
```

`@nestjs/config` loads `.env` values and exposes them through Nest dependency
injection. It is a direct dependency even if a related package happens to be present
transitively in the lockfile.

### 2. Add a configuration folder

Create the following API-local structure:

```text
apps/api/src/config/
└── validate-environment.ts
```

`validate-environment.ts` should export a function compatible with
`ConfigModule.forRoot({ validate })`. It receives the raw environment object, returns
normalized values, and throws an `Error` describing any invalid value.

Keeping the validator as a standalone function makes its defaulting and boundary
rules simple to unit test.

### 3. Register `ConfigModule` in `AppModule`

Update `apps/api/src/app.module.ts` to import the module before feature modules:

```ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: 'apps/api/.env',
  validate: validateEnvironment,
})
```

`isGlobal: true` makes `ConfigService` available throughout the API without repeated
module imports. If the API must also be runnable with its working directory set to
`apps/api`, confirm the final `envFilePath` works in both supported launch commands;
adjust it to a path derived from the application root if needed.

### 4. Consume configuration during bootstrap

Update `apps/api/src/main.ts` to obtain `ConfigService` from the application
container after `NestFactory.create(AppModule)`.

Read the validated `NEST_PORT` value with a typed lookup, then use that same value for both
`app.listen(...)` and the startup log. This removes the duplicate direct access to
`process.env.NEST_PORT` and ensures the displayed port is the port actually used.

### 5. Add the local-environment template

Create `apps/api/.env.example`:

```dotenv
NEST_NODE_ENV=development
NEST_PORT=4300
```

Developers can copy it to `apps/api/.env` for local overrides. Do not commit the
resulting `.env` file; the repository's root `.gitignore` already excludes `.env`
files.

### 6. Test and verify

Add unit tests alongside the validator to cover:

- defaults when `NEST_PORT` and `NEST_NODE_ENV` are absent;
- a valid custom port;
- non-numeric and out-of-range ports;
- an unsupported `NEST_NODE_ENV` value.

Then run:

```bash
pnpm --filter api check-types
pnpm --filter api test
pnpm --filter api build
```

Finally, run the API with its normal development command and verify that `NEST_PORT=4301`
in `apps/api/.env` causes the server to listen and log port `4301`.

## Future Extension

When new application-wide values are needed, add them to the same validator and
`.env.example` first. They must use the `NEST_` prefix; likely future values include
`NEST_DATABASE_URL`, `NEST_JWT_SECRET`, and `NEST_CORS_ORIGIN`. Secrets should have
no real values in `.env.example`; use descriptive placeholders instead.

If configuration grows into several distinct areas, split the configuration by domain
(for example, `database.config.ts` and `auth.config.ts`) while keeping `ConfigModule`
as the single application entry point.

## Acceptance Criteria

- `@nestjs/config` is a direct dependency of the API.
- Configuration is initialized once through global `ConfigModule` registration.
- `NEST_PORT` defaults to `4300` and rejects invalid port values at startup.
- `NEST_NODE_ENV` defaults to `development` and accepts only the documented values.
- All API-owned environment variable names use the `NEST_` prefix.
- `main.ts` has no direct reads of application environment variables.
- `apps/api/.env.example` documents the supported local settings without secrets.
- Validator tests cover both valid and invalid configuration.
- API type checking, tests, and build pass.
