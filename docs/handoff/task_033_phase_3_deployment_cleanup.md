# Task

033 — Phase 3 deployment evidence cleanup

Branch: `task/033-phase-3-deployment-cleanup`

Base main SHA: `6e02fafc63984f039a865e883d54ab2da892c409`

## Goal

Verify the real active deployment target, remove only stale and inert repository deployment configuration, and align current-state documentation without changing application or hosted-service behaviour.

## Evidence inspected

- Public GitHub repository metadata identifies `https://17-the-wild-oasis-blond.vercel.app` as the homepage. The status for the base-main Task 032 merge commit reports successful `Vercel` deployment completion.
- On 2026-09-10, requests to the production root and `/login` returned HTTP 200, the `The Wild Oasis` HTML title, Vercel response headers, and no obvious Vercel deployment-failure marker.
- `vercel.json` contains the required SPA catch-all rewrite and is retained unchanged.
- The tracked repository, package scripts, GitHub Actions workflow, and deployment-related documentation were searched for `netlify`, `netlify.tom`, `netlify.toml`, `netlify deploy`, and `netlify-cli`. No executable path, script, workflow, CLI dependency, or custom command consumes `netlify.tom`.
- Netlify's official file-based configuration documentation identifies `netlify.toml` as the repository configuration filename. The tracked file was instead named `netlify.tom`.

## Changed

- Removed inert `netlify.tom`; it was not the standard Netlify repository configuration filename and no tracked mechanism consumed it.
- Updated README deployment wording to state the verified Vercel platform, production URL, and retained SPA rewrite.
- Marked only the Phase 3 deployment-target cleanup item complete and corrected the related current-state deployment wording in `ROADMAP.md`.
- Updated the narrow deployment-config stack entry in `AGENTS.md` to remove the obsolete Netlify claim.

## Not Changed

- `vercel.json` is unchanged.
- No application source, dependencies, tests, CI, Supabase SQL, Auth Site URL or redirect URL settings, Vercel project settings, DNS, domains, environment variables, or hosted service configuration changed.
- Hosted Supabase Auth redirect settings were not inspected; this task makes no claim about their current state.
- Historical handoffs and historical Supabase security evidence that mention Netlify/Vercel were preserved.
- Screenshots and the final Phase 3 secret/deployment-config/documentation review remain out of scope.

## Verification

- `npm ci` passed, with existing transitive deprecation warnings.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 28 test files / 108 tests.
- `npm run build` passed. The existing large-chunk advisory remains at 974.10 kB minified / 279.47 kB gzip.
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories; the available remediation is the intentionally deferred breaking `react-router-dom@7.18.3` upgrade.
- The post-change repository search finds no executable/config reference to Netlify or the deleted `netlify.tom`. The remaining references are historical Task 032 and Supabase baseline evidence, plus the completed generic Phase 3 checklist wording.

## Risks / Notes

- The production URL and Vercel deployment status are publicly observable evidence of the active deployment path; private external Netlify resources were not inspected or changed.
- The remaining Netlify references are historical evidence, not current executable/configuration references. They should not be rewritten merely to make search results empty.
- The final Phase 3 review must still assess secrets, hosted deployment configuration, and documentation together. It must not infer that Supabase Auth redirect URLs were verified by this task.

## Next

Complete verified, non-sensitive application screenshots and then the separate final Phase 3 secret, deployment-config, and documentation review.
