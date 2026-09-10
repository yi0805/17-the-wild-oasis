# Task

032 — Phase 3 recruiter-facing README

Branch: `task/032-phase-3-recruiter-readme`

Base main SHA: `e95dd8ec6260223f0082383f4a43009cfcd0aab7`

## Goal

Replace the Vite starter README with concise, evidence-led English documentation for recruiters and engineers, while distinguishing the course/tutorial baseline from independent engineering work.

## Changed

- Replaced the starter README with project summary, verified Vercel deployment link and access constraint, architecture, security model, mutation-reliability examples, testing/CI information, engineering provenance, local setup, commands, deployment state, and documented limitations.
- Added a clear statement that `ProtectedRoute` is a UI navigation guard, while Supabase Auth, database RLS/grants, and Storage policies are the authorization boundary.
- Documented the active production TypeScript graph without claiming the repository is literally 100% TypeScript.
- Marked the completed Phase 3 Engineering evolution and verified design-decision checklist items in `ROADMAP.md`.
- Corrected the linked Supabase security evidence after review identified that its historical Phase 0.5 avatar-policy snapshot omitted the later verified Task 025 same-user SELECT/DELETE policies.

## Not Changed

- No application source, tests, dependencies, Supabase SQL/policies, Auth configuration, CI configuration, or hosting configuration changed.
- No screenshots were added. Tracked images are logos, a default user image, or cabin assets; none is a verified application screenshot.
- `netlify.tom` was retained. Vercel is independently verified as the active deployment, but the repository does not prove every Netlify configuration/resource is unused.
- The README does not claim successful previous-cabin-image cleanup: current code compensates for a failed database write after a new upload, while successful old-image cleanup remains deferred.

## Verification

- Verified GitHub `main` at `e95dd8ec6260223f0082383f4a43009cfcd0aab7` before branching.
- Independently checked `https://17-the-wild-oasis-blond.vercel.app`: it returned HTTP 200 and the application HTML title was `The Wild Oasis`. The GitHub repository homepage points to the same URL.
- Inspected `package.json`, `.env.example`, `.github/workflows/ci.yml`, `vercel.json`, `netlify.tom`, the Task 031 closeout, relevant Supabase evidence, active services, and the current image inventory before documentation changes.
- Reviewed the corrected security document against the Task 025 handoff, its manually applied SQL migration, and the current avatar service; README wording remains accurate and was not changed.
- `npm ci` passed (with existing transitive deprecation warnings).
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 28 test files / 108 tests.
- `npm run build` passed; the existing large initial-chunk warning remains at 974.10 kB minified / 279.47 kB gzip.
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The available remediation is the intentionally deferred breaking upgrade to `react-router-dom@7.18.3`.
- After the Task 025 evidence correction, `npm run lint`, `npm run typecheck`, `npm test` (28 test files / 108 tests), `npm run build`, and `git diff --check` passed again. The existing build chunk warning is unchanged.

## Risks / Notes

- Phase 3 remains incomplete: screenshots, deployment-configuration cleanup, and the final secret/deployment/documentation review remain open.
- Public signup is disabled, and the deployment is not described as an unrestricted public product demo.
- Storage buckets remain public-delivery buckets; MIME/file-size restrictions are deferred to Phase 4.
- Supabase CLI migration history remains unreconciled. Migrations were manually applied through Supabase SQL Editor; `supabase db push` is not assumed safe.

## Next

Complete the remaining Phase 3 screenshot, deployment-configuration, and final-review work in separately scoped tasks. Do not delete `netlify.tom` without independent evidence that it is unused.
