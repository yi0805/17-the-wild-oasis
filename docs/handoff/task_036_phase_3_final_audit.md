# Task

036 — Final Phase 3 secret, deployment-config, and documentation audit

## Branch

`task/036-phase-3-final-audit`

## Base main SHA

`6d1be894e26d73d976c72d79881d52a2e85964d7`

## Goal

Complete the evidence-based Phase 3 closeout without starting Phase 4 work.

## Audit scope

- Current tracked-tree credential and environment-configuration audit.
- Targeted Git-history audit for high-risk credential classes.
- Deployment configuration, public route, and stale-residue audit.
- README, AGENTS, ROADMAP, Supabase baseline, CI, script, screenshot, and final-verification consistency review.

## Secret audit

- Checked tracked environment files; only the placeholder-only `.env.example` is tracked. `.env` and `.env.local` are ignored, while `.env.example` is intentionally trackable.
- Searched the current tracked content for service-role and Supabase secret keys, private-key headers, AWS key IDs, GitHub token formats, OpenAI-style API-key formats, credential-bearing database URLs, and bearer tokens. No real credential was found.
- High-risk matches were only `service_role` policy prose in `AGENTS.md` and `ROADMAP.md`.
- Generic password, secret, and token matches were application validation, test names, placeholder/security prose, or historical evidence; no real login or demo credential was found.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.example` are placeholders for public browser-client configuration, not secrets.

## Git-history credential audit

- Searched all reachable history for the same high-risk credential classes without printing values.
- Matches occurred only in historical `AGENTS.md` and `ROADMAP.md` security-policy prose. No service-role key, private key, privileged API token, cloud credential, or credential-bearing connection string was found.

## Deployment audit

- Production URL: `https://17-the-wild-oasis-blond.vercel.app`.
- `vercel.json` remains unchanged and contains the required catch-all SPA rewrite.
- The production root, `/login`, and `/bookings` each returned HTTP 200 with Wild Oasis HTML and a Vercel response header; no authentication or production mutation was performed.
- Vite copied `public/_redirects` into `dist` before cleanup. No tracked script, dependency, GitHub Actions workflow, shell/PowerShell file, executable configuration, or current deployment documentation consumed it; no `netlify.tom` or `netlify.toml` exists. The file was removed as stale Netlify residue, and a rebuilt `dist` no longer contains `_redirects`.
- Remaining Netlify references are preserved historical evidence in Task 032/033 handoffs and the historical Supabase baseline. Current executable/configuration references are Vercel-only.

## Documentation audit

- Updated stale AGENTS current-state entries for the active TypeScript/TSX graph, Vitest/React Testing Library, GitHub Actions CI, typecheck, and the preferred command list.
- Labeled ROADMAP planning baseline and gap analysis material as historical, corrected its final-verification checklist from actual evidence, and narrowed resume language to completed reliability/testing/security work rather than uncompleted accessibility or async-state work.
- README claims, command documentation, Vercel description, provenance statement, and the three exact screenshot paths were verified; no README correction was necessary.
- Added a narrow Supabase baseline clarification: repository deployment evidence verifies Vercel, but Task 036 did not re-inspect hosted Supabase Auth Site URL or redirect settings.

## ROADMAP final-verification assessment

- `npm ci`, lint, typecheck, tests, build, CI workflow, current tracked-tree credential audit, documented Supabase authorization evidence, critical workflow evidence, and README accuracy are supported by this audit or existing focused tests/handoffs.
- Critical workflow evidence includes LoginForm, ProtectedRoute, CreateCabinForm and cabin service mutation tests, booking table/delete-confirmation and check-in/out tests, plus UpdateSettingsForm and settings service tests. The full suite passes 28 files / 108 tests.

## Changed

- `AGENTS.md`
- `ROADMAP.md`
- `docs/supabase/current-security-baseline.md`
- Removed `public/_redirects`
- This handoff

## Not Changed

- No application source, dependencies, tests, CI workflow, Vercel configuration, Supabase Auth configuration, RLS, Storage policies, migrations, hosted configuration, screenshots, or README content changed.
- No historical handoff or historical Supabase evidence was deleted or rewritten as current hosted state.

## Verification

- `npm ci`: passed; it reported dependency-wide advisories separately from the production-only audit.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 28 test files / 108 tests.
- `npm run build`: passed; Vite retained the existing 981.82 kB minified / 281.31 kB gzip initial-chunk warning.
- `npm audit --omit=dev`: two moderate React Router v6 advisories (GHSA-wrjc-x8rr-h8h6 and GHSA-337j-9hxr-rhxg); the offered remediation is the intentionally deferred breaking `react-router-dom@7.18.3` upgrade.
- `git diff --check`: passed.
- Public GitHub Actions API: the latest five `main` CI runs were completed successfully at audit time.

## Risks / Notes

- Hosted Supabase Auth Site URL and redirect configuration were not re-inspected and must not be inferred from the verified Vercel repository deployment.
- The production build warning and the two production dependency advisories remain documented deferred work.

## Phase 3 status

Phase 3 complete

## Next

Begin only a separately scoped Phase 4 task when prioritised; do not treat this audit as authorization to modify hosted services or begin accessibility, responsive, query-state, upload-validation, image-lifecycle, or bundle-optimization work.
