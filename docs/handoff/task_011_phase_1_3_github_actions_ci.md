# Task

011 — Phase 1.3 GitHub Actions CI

## Goal

Add and verify a minimal, least-privilege GitHub Actions quality gate for pull requests targeting `main` and for pushes to `main`.

Branch: `task/011-phase-1-3-github-actions-ci`

Base main SHA: `3bdf932021d20f46e73feba0f51adbb37441f235`

## Changed

- Added `.github/workflows/ci.yml`.
  - Triggers on `pull_request` targeting `main` and `push` to `main`.
  - Grants only `contents: read`; it uses no repository secrets, write permissions, privileged trigger, deployment, artifact upload, or external token.
  - Runs one `quality` job on `ubuntu-latest`.
  - Uses `actions/checkout@v7` and `actions/setup-node@v7` with Node 22.
  - Enables the official setup-node npm cache using `package-lock.json` as the cache-dependency path. It does not cache `node_modules`, build output, or test output.
  - Runs `npm ci`, `npm run lint`, `npm test`, and `npm run build` in that order. The workflow intentionally has no typecheck or audit step.
- Updated `ROADMAP.md` to complete the final Phase 1 CI checklist item and record the verified first PR run.

The workflow has no environment values because the existing Supabase module reports missing configuration at application runtime rather than failing the Vite build; local build and CI both require no hosted Supabase data or credentials.

## Not Changed

- No production source, package dependency, Supabase configuration/policy, Auth configuration, deployment configuration, branch protection, or repository secret changed.
- No TypeScript, `npm run typecheck`, Playwright, Cypress, coverage target, workflow matrix, audit gate, or additional workflow was added.
- The existing tests, lint configuration, Vite configuration, and package scripts remain unchanged.

## Verification

- Workflow structure was manually reviewed against GitHub Actions YAML requirements and existing package scripts. No local GitHub Actions validator was installed; `actionlint` was unavailable and Python had no YAML parser, so no repository dependency was added solely for validation.
- `npm ci` passed. npm printed existing transitive deprecation warnings and a full-install audit summary, but completed from the committed lockfile.
- `npm run lint` passed with zero warnings.
- `npm test` passed: 4 test files and 19 tests, including the 7 Task 009 service regressions and 12 Task 010 behavioural tests.
- `npm run build` passed. The existing Vite large-chunk advisory remains; the main chunk is 966.63 kB minified / 277.13 kB gzip.
- `git diff --check` passed.
- `npm audit --omit=dev` completed with 2 moderate React Router v6 advisories. npm's only fix is the out-of-scope breaking upgrade to `react-router-dom@7.18.3`; this matches the existing documented risk.
- First live GitHub Actions PR run: [run 34020140342](https://github.com/yi0805/17-the-wild-oasis/actions/runs/34020140342), `CI` workflow, `quality` job, status `success`.
  - Checkout, Set up Node.js, Install dependencies, Lint, Test, and Build each completed successfully.

## Risks / Notes

- Phase 1 is complete: the shared test foundation, 19 selected regressions, and verified pull-request/main-push CI now exist. No typecheck belongs in CI until Phase 2 actually introduces TypeScript and its script.
- The production-only audit still reports the two documented React Router v6 advisories. The available automatic remediation is a breaking v7 upgrade and remains deliberately deferred.
- Existing production build chunk-size advisory and the known inline cabin-image validation-message limitation remain deferred.

## Next

Phase 2 — Incremental TypeScript migration. Start with a small tooling/configuration milestone and verified Supabase-generated database types; do not start migration work as part of Task 011.
