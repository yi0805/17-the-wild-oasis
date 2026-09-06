# The Wild Oasis — Engineering Roadmap

## Project Goal

Develop The Wild Oasis into a **React + TypeScript operations dashboard** for operations staff. It should clearly demonstrate maintainable frontend architecture, reliable server-state/data mutations, verified Supabase authorization, and an engineering workflow with testing and CI.

On completion, a recruiter should quickly see these four signals:

1. React + TypeScript component, domain-model, and data-access design;
2. TanStack Query, React Hook Form, and explicit loading/error/empty states;
3. a real Supabase Auth, RLS, and Storage-policy security boundary; and
4. automated tests for critical business workflows and GitHub Actions CI.

## Current State

The project is a Vite + React 18 single-page operations dashboard. Protected routes cover the dashboard, bookings, check-in/out, cabins, settings, and account. Supabase provides Auth, PostgreSQL data, and Storage; TanStack Query manages server state; React Hook Form manages forms; styled-components provides UI styling; and Recharts provides dashboard charts.

Existing strengths:

- `services/` broadly separates Supabase calls from the UI, and feature-folder boundaries are generally clear;
- TanStack Query already has query keys, mutation success/error feedback, and pagination prefetching for cabins and bookings;
- route-level `ProtectedRoute`, a global `ErrorBoundary`, loading spinners, toasts, and dark mode already exist; and
- the production build passes, and Netlify and Vercel SPA rewrite configuration already exists.

Audit baseline (2026-09-02): `npm run build` passes; `npm run lint` fails on one `react-refresh/only-export-components` warning because of `--max-warnings 0`; no test script or test files exist; the build produces a 971.74 kB minified / 278.14 kB gzip main chunk; and `npm audit --omit=dev` reports 8 production dependency vulnerabilities (4 moderate, 4 high).

## Portfolio Positioning

The Wild Oasis should demonstrate that you can make a frontend business application reliable, secure, testable, and maintainable. It complements WhereRU:

- **The Wild Oasis:** React/TypeScript, frontend architecture, Supabase database/auth/security, client-side data handling, and quality automation;
- **WhereRU:** Python/FastAPI, AWS deployment, AI/Bedrock/Transcribe, PostgreSQL/pgvector, and backend/infrastructure; and
- **Combined value:** the former demonstrates product-frontend and managed-backend engineering fundamentals, while the latter demonstrates AI and cloud/backend breadth; the two do not unnecessarily duplicate each other.

Do not add Python/FastAPI, AWS, AI, microservices, Kubernetes, Kafka, Redis, GraphQL, Redux, or a standalone backend to this repository without a clear product reason. Supabase already suits this application; the real gap is engineering the existing client and Supabase boundary, not creating another stack.

## Gap Analysis

| Area | Current State | Target State | Priority | Resume Value |
| ---- | ------------- | ------------ | -------- | ------------ |
| Security and configuration | Public client configuration is environment-based; verified Supabase baseline/policy evidence and the applied forward migration are version-controlled; canonical deployment/Auth redirect URL remains unresolved | Retain verified least-privilege Auth/RLS/Storage rules and resolve deployment configuration in Phase 3 | P0 | High |
| Correctness and reliability | `updateSetting` likely requests a single row without `.select()`; cabin upload rollback can delete an edited cabin; query failures are rarely rendered | Tested mutation contracts, safe compensation/rollback, consistent error states | P0 | High |
| Dependency and lint baseline | Lint fails; two ESLint configs coexist; 8 production audit findings | One active lint config, passing checks, intentional compatible upgrades, and a recorded audit outcome | P0 | High |
| Automated testing | No test runner or test files | Vitest + React Testing Library behavioural regression suite for critical logic and workflows | P1 | High |
| Delivery workflow | No `.github/workflows` | GitHub Actions initially runs `npm ci`, lint, tests, and build; typecheck joins after TypeScript exists | P1 | High |
| Type safety | Entire application is JavaScript; domain/data contracts are implicit | Predominantly TypeScript application using verified Supabase-generated database contracts | P2 | High |
| Recruiter presentation | README is Vite starter text; no architecture/security/testing explanation | Evidence-led, honest README that distinguishes the course baseline from independent engineering work | P3 | High |
| UX, accessibility and responsiveness | Fixed desktop layout; custom modal lacks dialog semantics/focus management; forms have uneven validation | Targeted, measured improvements to important workflows | P4 | Medium |
| Performance | One large initial bundle; no route-level lazy loading or bundle budget | Measure first, then implement only justified optimisations | P4 | Medium |

## Phases

### Phase 0 — Security, baseline and correctness

**Objective:** remove immediate portfolio/security risks and establish a trustworthy baseline before structural work.

#### Phase 0.1 — Configuration and credential hygiene

- [x] Remove hard-coded login demo credentials; do not commit credentials or test identities.
- [x] Move `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to local environment configuration; add a safe `.env.example` and document that a publishable/anon key is public configuration, never a service-role secret.
- [x] Ensure local `.env` files are ignored while `.env.example` remains trackable.
- [x] Scan the repository for service-role keys and private credentials; record the result without treating the publishable key as a secret.
- [x] Verify valid and missing configuration paths in a browser without using or restoring demo login credentials.

**Manual verification:** create a local untracked `.env` from `.env.example` with the project's public client configuration; run the app and confirm the login inputs are blank and unauthenticated navigation reaches the login page. Temporarily remove one required variable and confirm the application renders the explicit configuration error. Do not commit the local `.env` or test credentials. Authenticated data loading remains a separate manual check requiring an authorised account.

#### Phase 0.2 — Correctness and mutation safety

- [x] Fix the settings update return contract by selecting the updated row before calling `.single()`.
- [x] Change cabin image mutation ordering so storage upload failure leaves an existing cabin unchanged; clean up a newly uploaded image if the subsequent database write fails.
- [x] Inspect and document the successful image-replacement lifecycle; prior owned-image cleanup is a separate, unresolved follow-up.
- [x] Perform the documented authenticated manual verification with a non-production test record; record the exact result. Automated regressions belong in Phase 1.

**Manual verification:** with an authorised test account and non-production data, change one settings value, refresh the page and confirm the persisted value and success feedback. Then edit an existing cabin with a new image while blocking the `cabin-images` Storage upload request in browser DevTools; confirm the mutation reports failure, the cabin row still exists after refresh, and its prior image remains. Finally, create a new cabin while blocking the database write after a successful image upload; confirm no cabin row is created and the uploaded object is removed. Do not run these destructive checks against shared production data.

**Recorded authenticated results (human-performed):** PASS. With an authorised account and non-production data, the Breakfast price changed, showed success feedback, persisted after refresh, and was restored successfully. Blocking the `cabin-images` upload while editing an existing cabin displayed `Cabin image could not be uploaded`; after removing the block and refreshing, the cabin and its baseline image remained and no attempted changes persisted. Allowing a new-image upload (HTTP 200) while blocking the subsequent `cabins` INSERT displayed `Cabin could not be saved`; the `cabin-images` cleanup request returned HTTP 200, and the attempted `test 1` cabin was absent after refresh.

**Image lifecycle decision:** the current successful edit path leaves the previous image in Storage. A future fix must receive or otherwise reliably identify the previous image, and treat it as deletable only when it is an application-owned object in `cabin-images`; external, seeded/default, or otherwise non-owned URLs must never be deleted. Safe ordering is new-image upload → database update → best-effort old-owned-object removal. If old-object removal fails, keep the successful database update and new image, log/record the orphan for retry, and do not delete the cabin or roll back to a potentially unavailable old image.

#### Phase 0.3 — Development/dead-code cleanup

- [x] Remove or isolate the destructive development `src/data/Uploader.jsx` so it cannot become production functionality.

#### Phase 0.4 — Lint and dependency baseline

- [x] Inspect each audit finding's direct/transitive dependency path, available compatible upgrades and practical risk before changing versions. Do not run `npm audit fix --force` or introduce a major version without an approved impact assessment.
- [x] Consolidate the ESLint configuration, fix the existing warning, and re-run lint/build/audit.

#### Phase 0.5 — Supabase Auth / RLS / Storage security review

- [x] **User-assisted Dashboard review:** established the trusted, equal-operations-user model from product requirements and actual Supabase configuration without inventing staff/admin roles.
- [x] **User-assisted Dashboard review:** verified Auth settings, RLS/grants for `bookings`, `cabins`, `guests`, and `settings`, and Storage policies for `avatars` and `cabin-images`; verified anonymous denial and each real authenticated access path.
- [x] **Repository work:** recorded the verified hosted schema/policy baseline and applied the reviewed forward migration manually through Supabase SQL Editor. No historical migration was fabricated.

**Definition of done:** lint and production build pass; no credentials or service-role secrets are tracked; authorization assumptions are documented and backed by real policies; the identified mutation fixes have reproducible manual-verification records. Automated regression tests for those fixes belong in Phase 1.

### Phase 1 — Regression safety and CI

**Objective:** protect existing behaviour before broad TypeScript migration.

- [x] Add Vitest and React Testing Library with one shared test setup; avoid coverage targets that reward trivial tests.
- [x] Add behavioural tests for important user flows and validation. Mock the data-access boundary only where necessary; do not mock TanStack Query, React Hook Form, or internal component details without a concrete reason.
- [x] Test service failure/rollback behaviour directly using controlled Supabase and Storage mocks, including the Phase 0 settings-update and cabin image-mutation cases.
- [x] Add GitHub Actions that uses `npm ci` and runs the commands available at this stage: lint, unit/integration tests and production build. Add `npm run typecheck` only in Phase 2 after the script exists.

**Definition of done:** selected high-risk behaviour has stable regression tests; CI reports `npm ci`, lint, tests and build for every pull request; tests do not mutate shared Supabase data.

### Phase 2 — Incremental TypeScript migration

**Objective:** reach a predominantly TypeScript application while keeping the tested application working throughout migration.

- [x] Add TypeScript tooling and a non-disruptive `tsconfig`; do not force unrelated hotfixes to convert whole files before this phase.
- [x] After a verified Supabase baseline exists, generate the Supabase `Database` types from the actual project schema and type the Supabase client with them. Treat generated table `Row`, `Insert` and `Update` contracts as the source of truth; do not hand-copy the full database schema into interfaces.
- [ ] Derive domain/UI types from generated database types where suitable, adding handwritten types only for non-database concepts or meaningful transformations.
- [ ] Convert services, data hooks and high-value feature boundaries first, then progressively convert the remaining application so JavaScript is temporary migration residue rather than the intended permanent state.
- [x] Add and pass `npm run typecheck`; extend CI to run it only once it exists.
- [ ] Add runtime validation only at genuinely untrusted boundaries, such as user files, URL input or third-party payloads. A validation dependency such as Zod requires a concrete runtime gap that generated types and controlled schema cannot cover.

**Definition of done:** the application is predominantly TypeScript, its Supabase client uses generated database contracts, and lint, typecheck, tests and build pass. A few deliberately scheduled JavaScript files may remain only with a documented migration reason.

### Phase 3 — Recruiter-ready documentation and release

**Objective:** make the engineering evidence honest, understandable, and easy to evaluate in 30–60 seconds.

- [ ] Replace the Vite starter README with English project summary, screenshots/demo, architecture, data/security model, setup, commands, tests, CI, deployment and verified limitations.
- [ ] Add an **Engineering evolution** section that states the project began from a course/tutorial baseline, distinguishes inherited functionality from independently implemented engineering improvements, and links claims to actual changes.
- [ ] Explain verified design decisions and trade-offs truthfully, including Supabase security, test scope and TypeScript migration. Do not claim tutorial functionality as wholly original work.
- [ ] Identify the real deployment target; retain only its required configuration and remove stale Netlify or Vercel configuration only after confirming it is unused.
- [ ] Conduct final secret, deployment-config and documentation review.

**Definition of done:** a reviewer can understand the app, its provenance, its independently implemented improvements and its real deployment path without reading the whole codebase.

### Phase 4 — Targeted frontend hardening

**Objective:** improve high-value user experience, resilience and performance based on evidence rather than broad redesign.

- [ ] Standardise important query loading, error and empty states.
- [ ] Improve modal keyboard semantics/focus handling and the most important responsive workflows.
- [ ] Validate file size/type for UX and enforce the matching server-side policy once the actual Storage model is known.
- [ ] Implement the documented owned-cabin-image lifecycle only after ownership can be identified safely; retain cleanup failures for retry rather than deleting successful data.
- [ ] Measure bundle composition and implement only justified route splitting or dependency optimisation.

**Definition of done:** selected critical workflows have verified accessibility/resilience improvements and every performance claim has a measurement.

## Optional stretch goals

- [ ] Add a small Playwright smoke suite only if a stable, isolated Supabase test environment and repeatable seed process can be created without disproportionate complexity. It is not required for project completion.
- [ ] Pursue further performance or end-to-end coverage only when supported by measured risk/value.

## Final Verification

- [ ] `npm ci` succeeds from `package-lock.json`.
- [ ] `npm run lint`, tests, `npm run typecheck` and `npm run build` pass; typecheck is required only after Phase 2 adds it.
- [ ] GitHub Actions runs the corresponding checks on pull requests.
- [ ] No tracked `.env` secrets, service-role keys or demo credentials; only safe example configuration is committed.
- [x] Supabase RLS and Storage policies have been verified for anonymous access and every actual authenticated access path; no roles are invented for portfolio presentation.
- [ ] Login, protected routes, cabin creation/editing, booking deletion, check-in/out and settings updates are tested or explicitly manually verified.
- [ ] README accurately distinguishes course-baseline functionality from independently implemented engineering work, and matches the actual implementation, scripts and chosen deployment configuration.

## Resume Outcome

Once complete, the project can be described truthfully as:

- Built a React + TypeScript operations dashboard using TanStack Query and Supabase, with explicit server-state and mutation handling.
- Designed and documented Supabase authentication, Row Level Security and Storage access controls for staff workflows.
- Added focused automated tests and GitHub Actions quality gates for critical booking and cabin-management flows.
- Improved frontend reliability and accessibility through validated forms, explicit async states and keyboard-accessible UI patterns.

These statements must clearly distinguish the course/tutorial baseline from the engineering improvements independently completed in this roadmap.

Any performance, coverage, bundle-size, or latency figure may be added to a resume only after it has been measured before and after the change and retained with supporting evidence.

## Decisions & Gotchas

- 2026-09-02 audit: build passes, lint fails on one Fast Refresh warning, and no automated test command exists yet.
- 2026-09-02 Phase 0.1: moved public Supabase client configuration to Vite environment variables, added a placeholder-only `.env.example`, ignored local `.env` files and removed prefilled login credentials. `git check-ignore` confirmed `.env` and `.env.local` are ignored while `.env.example` remains trackable; the repository scan found no service-role key, private key or tracked local environment file. Browser verification with an ignored `.env.local` confirmed that unauthenticated `/` navigation reaches the login page with blank fields. Removing the publishable key displayed the explicit application configuration error; the valid local configuration was restored afterwards. Authenticated data access was not tested because no account credentials were used. `npm run lint` still fails on the pre-existing Fast Refresh warning; this is deferred to Phase 0.4.
- 2026-09-02 Phase 0.2: `updateSetting` now selects the updated row before `.single()`. Cabin image uploads now occur before the database write; a failed edit upload leaves the existing row untouched, and a successful new upload is removed if its create/edit database write fails. `npm run build` passed; lint still has the existing Fast Refresh warning. Automated regression coverage remains scheduled for Phase 1.
- 2026-09-03 Phase 0.2 manual verification: human-performed authenticated verification against an authorised account and non-production data passed. Settings persistence/restoration worked; a blocked edit upload left the existing cabin and baseline image unchanged; and a blocked create database write removed the uploaded image with no `test 1` cabin row remaining.
- 2026-09-02 roadmap revision: behavioural regression tests and CI now precede TypeScript migration. CI starts with `npm ci`, lint, tests and build; `typecheck` joins only after Phase 2. Playwright is an optional stretch goal, not a completion requirement.
- 2026-09-02 cabin image lifecycle review: on a successful edit with a new image, the previous image is currently left in Storage. `createEditCabin` receives only the new image and cabin ID, so it cannot safely delete the old URL. Future cleanup must distinguish positively identified application-owned `cabin-images` objects from external/default/non-owned URLs. If old-object removal fails after a successful row update, preserve the new row/image and record the orphan for retry; never delete the cabin as compensation.
- 2026-09-03 Phase 0.3: `Uploader.jsx` was confirmed unused by the application and contained broad destructive delete-and-seed operations, so it was removed rather than retained as production functionality. `data-bookings.js`, `data-cabins.js`, and `data-guests.js` remain intentionally as non-executable development/test fixtures. No replacement seeding mechanism was introduced.
- 2026-09-03 Phase 0.4: removed the unused CRA ESLint configuration and `eslint-config-react-app`; `.eslintrc.cjs` remains the sole active configuration and `vite-plugin-eslint` remains enabled. Split the dark-mode context/hook from the provider component, so lint now passes without weakening `react-refresh/only-export-components`. Resolved the approved compatible package versions: `react-router-dom`/`react-router` 6.30.6 with `@remix-run/router` 1.23.4, `styled-components` 6.5.3, `lodash` 4.18.1, and `ws` 8.21.3 (satisfying the required 8.21.0-or-newer safe line) without upgrading Supabase. The Styled Components production `postcss`/`nanoid` path is gone. `npm audit --omit=dev` now reports two moderate React Router v6 findings: GHSA-wrjc-x8rr-h8h6 (CVE-2025-68470 bypass) and GHSA-337j-9hxr-rhxg (SSR hydration). npm identifies only the breaking `react-router-dom` 7.18.3 upgrade as a fix. This BrowserRouter declarative SPA has no SSR hydration and all current navigation destinations are internal/static or application-prefixed IDs; the v7 migration is deliberately deferred. Recharts v3 and Supabase package upgrades were also deliberately deferred. `npm ci`, lint, build, and direct-loopback `/` and `/login` route delivery passed; authenticated/dashboard interactive verification was not performed because no authorised account was used.
- Before the Phase 0.5 Dashboard review, Supabase roles, RLS, and Auth configuration were unverified. The roadmap deliberately referred to actual access paths to be discovered, rather than assumed staff/admin roles.
- If migration management is adopted, first capture and verify the existing hosted schema/policy baseline. Do not manufacture historical migrations; version-control only verified baseline artefacts and future changes.
- The checked-in Supabase `sb_publishable_...` key is a browser publishable key, not evidence of a service-role-key leak. It still belongs in environment configuration for safer per-environment operation. A `service_role` key must never enter the client bundle.
- `ProtectedRoute` only controls the React UI. It is not a database authorization boundary; RLS and Storage policies must be inspected in Supabase before making security claims.
- At the initial audit, no Supabase migrations, policy definitions, or Auth Dashboard configuration were present in the repository, so current RLS/Auth/Storage security could not be verified from source alone.
- 2026-09-06 Phase 0.5 preparation: the verified hosted baseline, browser-signup removal, and proposed forward-only security migration were prepared for review.
- 2026-09-06 Phase 0.5 completion: the human disabled public signup, raised the password minimum to 8, manually applied the reviewed migration through Supabase SQL Editor (`Success. No rows returned`), and re-verified metadata plus anonymous and authenticated access paths. The trusted equal-operations-user model is enforced without RBAC. The migration was not applied through Supabase CLI, and CLI migration history remains unreconciled; file-size/MIME limits, successful old cabin-image cleanup, and canonical deployment/Auth redirect URL remain deferred.
- 2026-09-06 Phase 1.1: added a Vite-integrated Vitest 0.34 test runner, jsdom, React Testing Library, and shared jest-dom/cleanup setup. Seven service tests use local fluent Supabase/Storage mocks and no environment credentials or hosted data. They cover the Phase 0 `updateSetting` return/error contract and `createEditCabin` upload failures, failed-write image compensation, existing-image handling, and successful new-image creation. UI behavioural tests and GitHub Actions remain deferred to Tasks 010 and 011.
- 2026-09-06 Phase 1.2: added 12 React Testing Library/user-event behavioural tests for cabin creation/editing and booking check-in flows. They retain real React Hook Form, TanStack Query, application hooks, and MemoryRouter navigation while mocking only cabin, booking, and settings service exports; no hosted Supabase data is accessed. GitHub Actions CI remains deferred to Task 011.
- 2026-09-06 Phase 1.3: added `.github/workflows/ci.yml` for pull requests targeting `main` and pushes to `main`. Its unprivileged Node 22 `quality` job uses `actions/checkout@v7`, `actions/setup-node@v7` with npm caching, then runs `npm ci`, lint, 4 test files / 19 tests, and the production build. The first PR run succeeded: [run 34020140342](https://github.com/yi0805/17-the-wild-oasis/actions/runs/34020140342). Typecheck remains a Phase 2 prerequisite, not a CI command yet.
- 2026-09-06 Phase 2.1: added TypeScript 6.0.3 tooling for incremental migration. `tsconfig.json` keeps existing JavaScript supported with `allowJs: true` and `checkJs: false`, while strict checking applies to migrated TypeScript under `src`. ESLint now covers TS/TSX with the TypeScript ESLint v8 recommended rules; `npm run typecheck` and the CI Typecheck step enforce the compiler gate. The existing 4 test files / 19 tests continue to pass. No production files were migrated; final GitHub Actions verification is recorded in the Task 012 handoff.
- 2026-09-06 Phase 2.2: generated `src/types/database.types.ts` from the authenticated hosted Supabase `public` schema with Supabase CLI 2.116.0, then typed the sole client boundary as `createClient<Database>` in `src/services/supabase.ts`. The generated contracts include `Row`, `Insert`, and `Update` for `bookings`, `cabins`, `guests`, and `settings`, with the verified booking-to-cabin and booking-to-guest relationships. No database schema was hand-written or mutated, and no migration-history command was run. Existing JS services, hooks, components, and tests were not migrated; the final GitHub Actions verification is recorded in the Task 013 handoff.
- 2026-09-06 Phase 2.3a: migrated the remaining application services to TypeScript using generated `Database` table aliases as their database source of truth. Local types describe only service inputs: booking list filter/sort options, cabin `File | string` mutations, and Auth login/current-user updates. Per-service runtime client guards narrow the intentionally nullable client only when an operation runs. No hooks, components, or tests were migrated; 4 test files / 19 tests, typecheck, and build passed locally. The implementation CI run [34024866859](https://github.com/yi0805/17-the-wild-oasis/actions/runs/34024866859) passed; final PR-head verification is recorded in the Task 014 handoff.
- 2026-09-06 Phase 2.3b: migrated 18 feature TanStack Query/data hooks to TypeScript using service-derived mutation variables and inferred service result types. `useBookings` now narrows URL sorting to the supported fields/directions with the existing default fallback, and `useBooking` converts the route ID at its boundary. Query keys, invalidations, navigation, and toast behavior remain intact; no components, pages, generic hooks, or tests were migrated. The legacy unsupported `active` invalidation property was replaced with the v4-equivalent all-query invalidation, preserving its actual runtime effect. Local typecheck, 4 test files / 19 tests, and build passed; final GitHub Actions verification is recorded in the Task 015 handoff.
- The project is small enough for incremental TypeScript migration to deliver real value. Convert boundaries first; do not pause feature work for a whole-repository rewrite.
