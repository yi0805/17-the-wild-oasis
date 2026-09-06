# Task

013 — Phase 2.2 Supabase generated Database types

## Goal

Generate database contracts from the actual hosted Supabase `public` schema and make the Supabase client the first typed production boundary, without migrating services, hooks, components, or tests.

Branch: `task/013-phase-2-2-supabase-generated-database-types`

Base main SHA: `96933b500911c7bbd36abf62a72f68fe7962bd47`

## Changed

- Generated `src/types/database.types.ts` from the actual hosted `public` schema using authenticated Supabase CLI `2.116.0` on 2026-09-06. The command shape was `npx --yes supabase@2.116.0 gen types typescript --project-id <locally-derived-project-ref> --schema public`; the project reference was derived only in memory from ignored local configuration and no credential or configuration value was recorded.
- The generated output contains public `Tables` contracts with `Row`, `Insert`, and `Update` for `bookings`, `cabins`, `guests`, and `settings`. Its actual schema also reports no public views, functions, enums, or composite types.
- Verified generated relationship metadata: `bookings.cabinId` references `cabins.id` through `bookings_cabinId_fkey`, and `bookings.guestId` references `guests.id` through `bookings_guestId_fkey`.
- Renamed `src/services/supabase.js` to `src/services/supabase.ts`, added a type-only `Database` import, and changed the client construction to `createClient<Database>(...)`.
- Changed the one explicit `.js` import in `src/main.jsx` to an extensionless import so the entry point resolves the renamed client boundary. Existing service imports already use extensionless resolution and were not changed.
- Updated the Phase 2 roadmap item and history entry.

## Not Changed

- No database contract was hand-written, simplified, or inferred from frontend code.
- No database schema, RLS, Auth, Storage policy, environment file, SQL migration, migration history, package dependency, or deployment configuration changed.
- No `db pull`, `db push`, `db reset`, `migration repair`, `supabase link`, or any other schema-mutating command was run.
- No service other than the Supabase client, data hook, component, test, or Vite configuration was migrated to TypeScript.
- The nullable-client runtime contract is unchanged: missing Vite configuration retains the explicit configuration error and exports `null`; configured values create the default typed client.

## Verification

- The generated hosted schema contains the four verified operational tables and both baseline booking foreign-key relationships. It did not materially contradict the Phase 0.5 baseline.
- `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` passed. Tests remain 4 files / 19 tests.
- `npm audit --omit=dev` reports the already documented two moderate React Router v6 advisories. Its only remediation is the out-of-scope breaking `react-router-dom@7.18.3` upgrade; no audit fix was applied.
- Final GitHub Actions run ID/URL and final PR-head SHA are recorded after the pull-request workflow completes. It must pass Checkout, Set up Node.js, Install dependencies, Lint, Typecheck, Test (4 files / 19 tests), and Build.

## Risks / Notes

- Supabase CLI authentication was used only for read-only hosted-schema introspection. Its temporary local metadata was removed and no credentials were printed or committed.
- Generated output is source-of-truth code and required no lint exception.
- Existing JS consumers are temporarily unchecked because the deliberate migration configuration retains `allowJs: true` and `checkJs: false`; Task 014 will migrate the service and data-hook layer.

## Next

Task 014 — Phase 2.3 service and data-hook TypeScript migration. Migrate service/data boundaries incrementally from the generated database contracts; do not hand-copy their table interfaces.
