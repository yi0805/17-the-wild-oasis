# Task

012 — Phase 2.1 TypeScript tooling baseline

## Goal

Establish a safe TypeScript foundation for incremental migration without changing product behaviour or converting existing JavaScript/JSX production files.

Branch: `task/012-phase-2-1-typescript-tooling-baseline`

Base main SHA: `386989bf6cf78f609b45e2c734b57e5d70434225`

## Changed

- Added TypeScript `~6.0.0`, resolved as `6.0.3`, plus `@typescript-eslint/parser@8.69.0` and `@typescript-eslint/eslint-plugin@8.69.0` as development tooling. The lockfile contains only their legitimate transitive dependencies; no existing direct package was upgraded.
- Added `tsconfig.json` for `src`: `allowJs: true`, `checkJs: false`, `strict: true`, `noEmit: true`, `jsx: react-jsx`, `target`/`lib` ES2020 + browser APIs, `module: ESNext`, `moduleResolution: Bundler`, `skipLibCheck: true`, and `resolveJsonModule: true`.
  - `allowJs: true` keeps the existing JavaScript/JSX application coexisting with future TypeScript files.
  - `checkJs: false` avoids applying new compiler diagnostics to unmigrated JavaScript while strict checking applies to migrated TS/TSX files.
- Added `src/vite-env.d.ts` with the standard Vite client declaration and no environment values.
- Extended the existing ESLint 8 legacy configuration with a TS/TSX-only `@typescript-eslint/parser` override and the non-type-aware recommended TypeScript rules. The lint script now covers `js,jsx,ts,tsx`; JavaScript rule behaviour is otherwise unchanged.
- Added `npm run typecheck` (`tsc --noEmit`) and the `Typecheck` step to the existing least-privilege GitHub Actions quality job after lint.
- Updated Phase 2 roadmap checkboxes and its 2026-09-06 Phase 2.1 history entry.

## Not Changed

- No production JS/JSX, services, hooks, components, test files, or Vite configuration were migrated or renamed.
- No Supabase-generated `Database` types, client typing, RLS, Auth, Storage, migration, runtime-validation, deployment, or product behaviour change was made.
- ESLint, Vite, React, Vitest, React Router, and all existing direct dependencies remain on their existing major versions.

## Verification

- Baseline `origin/main` was fetched and confirmed at `386989bf6cf78f609b45e2c734b57e5d70434225`. Before changes, `npm ci`, `npm run lint`, `npm test` (4 files / 19 tests), and `npm run build` passed.
- Final local `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` passed. Tests remained 4 files / 19 tests.
- `npm audit --omit=dev` reports the already documented two moderate React Router v6 advisories. npm's only remediation is the out-of-scope breaking `react-router-dom@7.18.3` upgrade; no audit fix was applied.
- GitHub Actions implementation validation: [run 34020819661](https://github.com/yi0805/17-the-wild-oasis/actions/runs/34020819661) passed on `f9a3684e2774372027530acd4bfc476cb213c2e7`. Checkout, Set up Node.js, Install dependencies, Lint, Typecheck, Test (4 files / 19 tests), and Build all passed. The documentation-only follow-up commit is verified by the final replacement PR-head workflow in the completion report.

## Risks / Notes

- TypeScript 6.0.3 is within the supported `>=4.8.4 <6.1.0` peer range of the installed typescript-eslint tooling. The ESLint override intentionally does not set `parserOptions.project`, keeping lint non-type-aware and suitable during migration.
- The existing Vite production-build large-chunk advisory remains unchanged.
- This establishes tooling only; strict coverage increases as application files are intentionally migrated in subsequent Phase 2 milestones.

## Next

Task 013 — Phase 2.2 Supabase generated Database types. Verify the actual Supabase schema baseline, generate its database contracts, and type the client without hand-writing the schema. Do not begin that work as part of Task 012.
