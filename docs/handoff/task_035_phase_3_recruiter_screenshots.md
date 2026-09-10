# Task

035 — Phase 3 verified recruiter screenshots

## Branch

`task/035-recruiter-screenshots`

## Base main SHA

`49b33d65a5470eb9d048e6e1c3d2a6c34d708640`

## Goal

Add a small, polished, truthful visual overview of the current application to the recruiter-facing README.

## Screenshot source

The screenshots were rendered from the local Vite application using the current Task 035 base code. The production deployment was not used as a screenshot source because no real authenticated identity or production guest data should appear in committed portfolio evidence.

## Capture method

Chrome 152 headless rendering at desktop zoom and device scale factor 1 used Chrome DevTools Protocol request interception only for local display data. The real application routes, React components, styling, and layout rendered the screenshots. Browser chrome, operating-system chrome, DevTools, loading states, and an application development-tools toggle were excluded from the final viewport captures. No image generation, synthetic UI construction, DOM value alteration, or image editing was used.

## Data source

Representative local intercepted Auth and Supabase REST responses supplied a fictional operator identity and fictional accommodation, booking, guest, status, and chart data. Guest emails use the reserved `example.test` domain. No hosted Supabase read or mutation was performed for screenshot preparation, and the data is not production data.

## Screenshots added

| File | Route/view | Theme | Viewport and image dimensions | Approximate size | Data |
| --- | --- | --- | --- | --- | --- |
| `docs/screenshots/dashboard.png` | `/dashboard?last=7` — Dashboard | Light | 1440 × 1000 | 92.8 kB | Representative locally intercepted data |
| `docs/screenshots/bookings.png` | `/bookings?status=all&sortBy=startDate-desc&page=1` — All bookings | Light | 1440 × 1000 | 113.5 kB | Representative locally intercepted data |
| `docs/screenshots/cabins.png` | `/cabins?discount=all&sortBy=name-asc` — All cabins | Light | 1440 × 1000 | 95.9 kB | Representative locally intercepted data |

## Sensitive-data review

Each final PNG was opened and manually reviewed before commit. The views show only a fictional `Oasis Operations` operator and fictional guest names with reserved example-domain email addresses. No real names, personal email addresses, avatars, customer records, tokens, API keys, session/localStorage data, headers, browser URLs, filesystem paths, console output, DevTools, or OS/browser chrome are visible. No screenshot was rejected after the final pass; initial loading/empty-state capture attempts were rejected and overwritten before this handoff was written.

## README changes

- Added the minimal `## Screenshots` section immediately after Live deployment, with Dashboard first, then Bookings and Cabins.
- Linked the three exact lowercase PNG paths with accurate alt text.
- Removed only the completed screenshot-capture limitation.

## ROADMAP changes

- Marked the Phase 3 README/screenshots evidence milestone complete.
- Added a narrow Task 035 history entry.
- Left the final Phase 3 secret, deployment-config, and documentation review open; Phase 3 itself is not marked complete.

## Changed

- `README.md`
- `ROADMAP.md`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/bookings.png`
- `docs/screenshots/cabins.png`
- This handoff.

## Not Changed

- No application source, UI styling, routes, queries, mutations, services, Auth settings, Supabase data/policies, Vercel configuration, CI, dependencies, tests, or React Router version changed.
- No credentials, real user identity, session, production guest data, screenshot automation, or generated image was committed.
- The separate final Phase 3 secret, deployment-config, and documentation audit was not started.

## Verification

- `npm ci`: passed with existing transitive deprecation warnings.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 28 test files / 108 tests.
- `npm run build`: passed; retained the existing 981.82 kB minified / 281.31 kB gzip large-chunk advisory.
- `npm audit --omit=dev`: reported only the two documented moderate React Router v6 advisories (GHSA-wrjc-x8rr-h8h6 and GHSA-337j-9hxr-rhxg). npm offers only the intentionally deferred breaking `react-router-dom@7.18.3` upgrade.
- `git diff --check`: passed.
- Screenshot files exist, open successfully as PNG, and are each 1440 × 1000.
- Manual visual and sensitive-data review passed for all three final images.
- README links use the exact tracked relative paths and filenames.
- The production deployment root and `/login` each returned HTTP 200 without signing in or mutating production.
- Post-push GitHub README image rendering and GitHub Actions status are recorded after the branch is pushed.

## Risks / Notes

- Visual evidence is intentionally based on representative local data, not production data.
- The current development build emits existing React Router future-flag and styled-components unknown-prop console warnings during local capture. They are not visible in the committed screenshots and are outside this documentation-only task.

## Next

1. Complete the remaining verification, push, and Pull Request review for Task 035.
2. Conduct the separately scoped final Phase 3 secret, deployment-config, and documentation review.
