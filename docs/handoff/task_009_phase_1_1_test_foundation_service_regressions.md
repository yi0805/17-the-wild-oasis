# Task

009 — Phase 1.1 test foundation and Phase 0 service regressions

## Goal

Add a minimal, Vite-compatible Vitest and React Testing Library foundation, then protect the highest-risk Phase 0 settings and cabin-image mutation contracts with focused service tests.

Branch: `task/009-phase-1-1-test-foundation-service-regressions`

## Changed

- Added the CI-friendly `npm test` script (`vitest run`).
- Added development-only Vitest 0.34.6, React Testing Library 14.3.1, `@testing-library/jest-dom` 6.6.3, and jsdom 22.1.0 dependencies. They are compatible with the existing React 18 and Vite 4 stack and do not affect the production browser bundle.
- Extended the existing `vite.config.js` with one jsdom test environment and shared setup file at `src/test/setup.js`. The setup registers jest-dom and cleans up React Testing Library renders after each test.
- Added `src/services/apiSettings.test.js` coverage for `updateSetting()`:
  - updates the `settings` row with `id = 1`;
  - calls `select().single()` and returns Supabase's updated row;
  - preserves the public `Settings could not be updated` failure error.
- Added `src/services/apiCabins.test.js` coverage for `createEditCabin()`:
  - a failed new-image upload rejects with `Cabin image could not be uploaded` and does not perform a database mutation;
  - failed create and edit database writes after a successful upload remove precisely the generated uploaded object and reject with `Cabin could not be saved`;
  - an existing application-owned Supabase image URL skips upload and cleanup while returning the updated row;
  - a successful new-image create returns Supabase's row and does not perform cleanup.
- Updated Phase 1 in `ROADMAP.md` to mark only the completed shared-test-foundation and service-regression items.

The test doubles replace the `./supabase` module with small local fluent chains matching the production calls. They do not import the real client, read environment configuration, or access hosted Supabase data. Cabin tests mock `Math.random()` for generated object names and restore globals after every test.

Vitest was chosen over a separate Jest configuration because it integrates with the existing Vite configuration. React Testing Library and jest-dom are required for the forthcoming behavioural UI tests; jsdom supplies the browser-like environment. The maintenance cost is four pinned compatible development-tool lines and their lockfile dependencies. No runtime dependency, coverage tooling, browser automation, or `@testing-library/user-event` was added.

## Not Changed

- No production service code or application behaviour changed.
- No hosted Supabase project, RLS policy, Storage policy, Auth configuration, environment configuration, or credentials were accessed or changed.
- No Phase 1.2 UI behavioural tests, GitHub Actions workflow, TypeScript/typecheck, Playwright, Cypress, coverage target, or `@testing-library/user-event` were added.
- The known successful old-cabin-image replacement cleanup limitation remains deferred.

## Verification

- `npm ci` passed. npm printed existing transitive deprecation warnings and a full-install audit summary, but completed with the lockfile.
- `npm run lint` passed with zero warnings.
- `npm test` passed: 2 test files and 7 tests.
- `npm run build` passed. The existing Vite large-chunk advisory remains; the main chunk is 966.63 kB minified / 277.13 kB gzip.
- `npm audit --omit=dev` completed with 2 moderate React Router v6 advisories. npm's only fix is the out-of-scope breaking upgrade to `react-router-dom@7.18.3`; this matches the existing documented risk.
- `git diff --check` passed.

## Risks / Notes

- The test suite currently protects data-access contracts, not rendered user workflows. It is intentionally small and has no coverage target.
- Tests assert the fluent Supabase call shapes that are part of the service contracts, while avoiding real Supabase connections and credentials.
- The existing React Router v6 audit advisories remain deferred because the application is a declarative BrowserRouter SPA and the available automated remediation is a breaking v7 migration.

## Next

Task 010 — Phase 1.2 behavioural regression tests. Add selected rendered user-flow and validation coverage using the new foundation; do not add GitHub Actions until Task 011.
