# Copilot instructions for heroku-expense-tracker-angular-fe

Purpose
- Short, actionable guidance for Copilot sessions working on this repo. Focus on build/test/lint commands, architecture, and repo-specific conventions.

Build, test, and lint (how to run)
- Install: npm install
- Dev server (local): npm run start-local  # runs `ng serve` -> http://localhost:4200
- Run built app (production-style, serves dist): npm run start  # runs node server.js
- Build (production default): npm run build
- Build (watch/dev): npm run watch
- Tests: npm run test  # runs `ng test --watch=false` (Karma)
  - CI-style: npm run test -- --watch=false --no-progress --browsers=ChromeHeadlessCI
  - Run a single spec quickly: mark the spec with `fit`/`fdescribe` (preferred for quick dev feedback).
- Lint: npm run lint (ESLint). Auto-fix: npm run lint -- --fix
- Generate API client from OpenAPI: npm run generate-expense-api-client

High-level architecture
- Single-page Angular application (project name: `heroku-expense-tracker`). Source: `src/`.
- Static Node/Express server (server.js) used only to serve the built `dist/heroku-expense-tracker` for Heroku/production.
- CI/CD: CircleCI config builds, lints, runs tests, produces dist/, and builds/pushes a Docker image (see `.circleci/config.yml`).
- API client generation: uses @openapitools/openapi-generator-cli to produce a TypeScript-Angular client under `src/app/generated-sources/expense-api`.
- Optional/ancillary techs mentioned in docs: PrimeNG (UI), Keycloak (auth), NgRx (state). These may or may not be fully integrated — check `src/app` for usage.

Key conventions and repository-specific rules
- Component/directive selectors
  - Prefix: `het`
  - Directive selector style: attribute, camelCase
  - Component selector style: element, kebab-case
  These are enforced by `.eslintrc.json` (@angular-eslint rules).

- Generated sources
  - Put OpenAPI-generated code under `src/app/generated-sources/*`. ESLint ignores `**/generated-sources/*`.
  - Avoid editing generated code directly; regenerate via the provided script when the API changes.

- Linting and code rules
  - ESLint is enforced (see `.eslintrc.json`). Important rules:
    - No unused imports / variables (unused-imports plugin). Intentional unused identifiers should be prefixed with `_`.
    - No `console` calls and no warning comments (these are errors).
    - RxJS naming conventions: follow the `rxjs/finnish` rules (use `$` suffix for observables and follow configured naming policies).

- Tests and CI
  - CI expects Chrome Headless (`ChromeHeadlessCI`). To reproduce CI locally, run tests with the same browser flag and ensure Chrome is available.
  - Karma is the test runner used by `ng test` (per README); project also includes some modern dev deps (vitest present in devDependencies) — confirm test infra before switching.

Files and locations of interest (quick pointers)
- Main app: src/
- Node static server used for Heroku: server.js
- ESLint config & rules: .eslintrc.json
- Angular CLI config: angular.json
- CircleCI pipeline: .circleci/config.yml
- OpenAPI generator: script `generate-expense-api-client` in package.json

Existing assistant/AI config files
- No CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules, or other assistant rules were found. No existing `.github/copilot-instructions.md` existed — this file was added to provide that guidance.

If you want changes merged differently
- If this should be edited/committed to a branch or follow a different tone/format, say so and specify preferred location/commit message.

---

(End of copilot instructions)
