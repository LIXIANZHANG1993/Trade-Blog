# Copilot Instructions for Trade_Blog

## Build, test, and lint commands

- Install dependencies: `npm install`
- Start dev server: `npm start` (alias for `ng serve`)
- Build (production by default): `npm run build`
- Build in watch + development mode: `npm run watch`
- Run all unit tests (Vitest via Angular builder): `npm run test`
- Run a single test file: `npm run test -- --watch=false --include src/app/app.spec.ts`
- Run tests matching suite/test name: `npm run test -- --watch=false --filter "should render title"`
- Show available unit-test options: `npm run test -- --help`

There is currently no dedicated lint script in `package.json`.

## High-level architecture

- This is a single Angular application workspace (`Trade_Blog`) using Angular 21 and the modern standalone bootstrap flow.
- Entry point is `src/main.ts`, which bootstraps the standalone root component `App` with `appConfig`.
- Global app wiring lives in:
  - `src/app/app.config.ts` for providers (router + browser global error listeners).
  - `src/app/app.routes.ts` for route definitions (currently empty).
- Root UI is `src/app/app.ts` + `src/app/app.html`:
  - `App` is a standalone component importing `RouterOutlet`.
  - `title` is managed as an Angular `signal`.
  - The current template is largely the Angular starter markup and includes a large inline `<style>` block in `app.html`; `app.css` is currently empty.
- Static assets come from `public/` (configured in `angular.json`).

## Key conventions in this repository

- Use standalone Angular APIs (no `NgModule` pattern in current code).
- Keep TypeScript and Angular compiler strictness enabled (`strict`, `strictTemplates`, `strictInjectionParameters`, etc. in `tsconfig*.json`).
- Formatting conventions:
  - 2-space indentation (`.editorconfig`)
  - single quotes for TypeScript (`.editorconfig`, `.prettierrc`)
  - Angular HTML files are formatted with Prettier’s `angular` parser (`.prettierrc`)
- Unit tests are written with Angular `TestBed` and run with the Vitest-based Angular unit-test builder (`@angular/build:unit-test`).
- Use the configured app prefix `app` for generated selectors (`angular.json`).

## Existing assistant/tooling config to respect

- `.vscode/mcp.json` configures an `angular-cli` MCP server (`npx -y @angular/cli mcp`).
- When generating Angular-specific guidance or edits, prefer Angular CLI/MCP-aware workflows where available.
