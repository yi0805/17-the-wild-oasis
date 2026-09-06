# Task

014 — Phase 2.3a Service layer TypeScript migration

## Goal

Migrate the remaining service/data-access modules to strict TypeScript using the generated Supabase contracts, without crossing into TanStack Query hooks or React components.

Branch: `task/014-phase-2-3-service-layer-typescript-migration`

Base main SHA: `0e39099630b85ce85b356127fd89aaa93577269e`

## Changed

- Renamed `apiAuth.js`, `apiBookings.js`, `apiCabins.js`, and `apiSettings.js` to `.ts`.
- Database contracts use generated `Tables`, `TablesInsert`, and `TablesUpdate` aliases: booking IDs/updates, settings updates, and cabin IDs/insert/update fields remain derived from `database.types.ts`.
- Added only local non-database service types: login credentials; current-user password, full-name, and avatar input; booking status filter, start-date sort, and pagination options; and cabin mutation input with `File | string` image data.
- Each service has a small local operation-time client guard. It narrows the nullable client without changing module-import behavior; configured operation behavior is unchanged and missing configuration still reaches the existing entry-point configuration failure path.
- `apiSettings` retains the ID 1 update/select/single contract and existing public errors.
- `apiBookings` retains count, ranges, joins, date-string inputs, query errors, update/select/single, and delete behavior. Its narrow filter/sort contract matches actual callers: status equality and start-date ascending/descending sorting.
- `apiCabins` retains upload-before-write, failed-write cleanup, no-storage existing-image edits, and no old-image deletion. The image-path calculation is split only to narrow `File | string`; replacing `replaceAll("/", "")` with global slash replacement is equivalent under the ES2020 target.
- `apiAuth` uses the official `UserAttributes` type for update payloads and retains login, session, logout, avatar filename, upload, and public URL behavior. A guard handles the SDK's nullable successful-user response before an avatar upload.

## Not Changed

- No TanStack Query hook, React component, test, Vite configuration, generated database contract, database schema, SQL migration, environment file, dependency, RLS, Auth, Storage policy, or deployment configuration changed.
- Tests required no edits; their existing extensionless mocks continued resolving the renamed modules.
- No handwritten database-row interface, `any`, unsafe assertion, non-null assertion, suppression directive, or TypeScript configuration weakening was added.

## Verification

- `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` passed. Tests remain 4 files / 19 tests.
- `npm audit --omit=dev` reports the existing two moderate React Router v6 advisories. Its only remediation is the out-of-scope breaking `react-router-dom@7.18.3` upgrade; no audit fix was applied.
- GitHub Actions implementation validation: [run 34024866859](https://github.com/yi0805/17-the-wild-oasis/actions/runs/34024866859) passed on `2396cf0b54a4f78d4db5a62c5cdece324c4a7b07`. Checkout, Set up Node.js, Install dependencies, Lint, Typecheck, Test (4 files / 19 tests), and Build all passed. The documentation-only follow-up commit is verified by the final replacement PR-head workflow in the completion report.

## Risks / Notes

- JavaScript hooks/components deliberately remain unchecked by TypeScript while `allowJs: true` and `checkJs: false` support the incremental migration.
- The existing Vite large-chunk advisory remains unchanged.

## Next

Task 015 — Phase 2.3b TanStack Query/data-hook TypeScript migration. Migrate hooks incrementally against these typed service contracts; do not begin that task in Task 014.
