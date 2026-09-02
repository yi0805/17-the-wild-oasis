# AGENTS.md

The Wild Oasis is a single-page dashboard for accommodation operations staff to manage cabins, bookings, check-in/out, settings, and staff accounts. This document defines the repository's long-term engineering rules.

## Project Positioning

This project must demonstrate modern React/TypeScript frontend engineering, reliable client-side data handling, a Supabase security boundary, testing, and CI. WhereRU already demonstrates Python/FastAPI, AWS, AI, infrastructure, and backend capabilities. Unless there is a clear, documented engineering reason, this repository must not duplicate that stack or add AI, AWS, microservices, Kubernetes, Kafka, Redis, GraphQL, Redux, or a standalone backend merely for resume keywords.

## Stack

| Layer | Technology |
| ----- | ---------- |
| Frontend | React 18, JavaScript/JSX (planned incremental migration to TypeScript), React Router 6 |
| Server State | TanStack React Query 4 |
| Forms | React Hook Form |
| Database/Auth/Storage | Supabase JavaScript client |
| UI | styled-components, react-icons, react-hot-toast |
| Charts and dates | Recharts, date-fns |
| Error handling | react-error-boundary |
| Build/deployment config | Vite 4, Netlify SPA redirects, Vercel rewrites |
| Testing | Not yet installed; ROADMAP Phase 1 will add Vitest + React Testing Library |
| CI | Not yet configured; ROADMAP Phase 1 will add GitHub Actions |

## Architecture Rules

- `pages/` composes route-level pages only; `features/` organises business-domain UI, hooks, and workflows; `ui/` contains reusable components with no business meaning; `services/` is the Supabase/data-access boundary; and `utils/` contains only shared side-effect-free helpers.
- Components must have a single responsibility. Do not mix Supabase calls, query orchestration, and complex UI in the same component.
- All server reads and writes must go through feature hooks and `services/`. Maintain stable, explainable query keys; after a successful mutation, invalidate only affected query keys rather than refreshing every query by default.
- Every asynchronous route and feature must explicitly handle loading, error, and empty states. The global ErrorBoundary handles render errors only and cannot replace query error UI.
- Form validation must consider HTML constraints, client feedback, and database policy. Client validation improves user experience; it is not a security boundary.
- The TypeScript migration begins in ROADMAP Phase 2. It must be incremental but end in a predominantly TypeScript application: migrate service/domain contracts and hooks first, then the forms/components that use them. Do not rewrite the entire application merely to change file extensions to `.tsx`, and do not require unrelated hotfixes to migrate whole files.
- After a Supabase baseline has been verified, use Supabase-generated `Database` types as the source of truth for table `Row`, `Insert`, and `Update` contracts, and type the Supabase client accordingly. Add supplementary types only for non-database domain/UI transformations; do not hand-copy the full schema.
- Route parameters, URL search parameters, file input, and third-party payloads are runtime input. Add runtime validation only at genuinely untrusted boundaries; do not add Zod/schemas to every Supabase response by default. A new validation dependency requires a concrete runtime use case.

## Security Rules

- Do not commit `.env` files, real login credentials, access tokens, service-role keys, private keys, or production data dumps. Commit only a safe `.env.example`.
- The browser may use only `VITE_SUPABASE_URL` and the Supabase publishable/anon key. This is public configuration and must not be presented as a secret; a `service_role` key must never enter the Vite client, Git history, or CI logs.
- React `ProtectedRoute` is only a UI navigation guard. Real authorization must be enforced by Supabase RLS, Storage policies, and Auth configuration. First determine the product's actual requirements and existing access model; do not invent staff/admin RBAC for portfolio value.
- Every table and Storage bucket must have verified policies. Test anonymous access and every real authenticated access path. Do not rely on client-side hidden buttons for authorization.
- Staff provisioning, password/account actions, and file uploads must have a clear authorization path. If a privileged server operation is needed, use an authenticated Supabase server-side mechanism; never expose elevated credentials in the browser.
- Validate file MIME type and size in the client for UX, and enforce equivalent constraints/policies server-side. Avoid predictable or colliding file names.
- User-visible errors must be actionable without exposing internal query details; detailed diagnostics must go only to an appropriate development/observability channel.
- If Supabase migrations are adopted, first establish and verify the current hosted database/schema/RLS/Storage baseline. Do not fabricate historical migrations. Future changes after that baseline must be version-controlled normally.

## Testing Rules

- Before ROADMAP Phase 1, do not imply that `npm test` exists or report tests that were not run.
- Prefer behavioural tests for pure business logic, data-access failure behaviour, form validation, and critical workflows (login/protected route, cabin create/edit, booking delete, check-in/out, and settings update), rather than component internals.
- Mock the data-access boundary in UI/feature tests only where necessary. Do not mock TanStack Query, React Hook Form, or internal component implementation without a concrete reason.
- Test service failure/rollback behaviour directly with controlled Supabase/Storage mocks. Do not allow local/unit tests to write shared Supabase data.
- Vitest + React Testing Library and GitHub Actions are required outcomes. Playwright is an optional stretch goal only if an isolated, repeatably seeded Supabase environment can be established with reasonable complexity.
- CI must start with `npm ci` and run the lint, tests, and build commands that exist at that stage. Add `typecheck` to CI only after Phase 2 actually introduces it.
- Do not pursue meaningless 100% coverage. When critical business behaviour is added or fixed, add tests that can catch its regression.
- For every milestone, run the lint, typecheck, test, and build commands that actually exist, and report why any required check could not be run.

## Code Quality

- Follow the currently active ESLint configuration. Fix warnings; do not conceal them with broad disables or a higher warning threshold.
- Keep naming, import casing, and file names consistent. When fixing an obvious typo such as `constatns`, first confirm every import and handle it in a separate, reviewable milestone.
- Remove or isolate dead/tutorial-version files, commented-out implementation, and dangerous development utilities. Do not assume an item is unused before deleting it.
- Comments must explain rationale, trade-offs, or non-obvious constraints rather than restating code. Split large components by responsibility before introducing unnecessary design patterns.
- Every new dependency must state its engineering rationale, maintenance cost, bundle/security impact, and alternatives. Run audit, lint, and build after dependency changes.
- Measure performance optimisations first; record the baseline and outcome, and do not invent metrics.
- The cabin image lifecycle must distinguish application-owned Storage objects from external/default URLs. After a successful replacement, a failed old-object cleanup must be recorded for retry, never compensated by deleting the cabin or the new image.

## Repository Language

All version-controlled project materials MUST use English, including:

- source code, variable/function names, comments, docstrings, UI copy, and error messages;
- README files, architecture documentation, `AGENTS.md`, `ROADMAP.md`, and handoff documents;
- Pull Request titles and descriptions; and
- commit messages and other commit-quality documentation.

Private, uncommitted local notes may use any language.

## Portfolio Honesty

- README files, screenshots, resume bullets, and project documentation must clearly state that The Wild Oasis began from a course/tutorial baseline.
- Distinguish inherited functionality from engineering improvements independently completed in this roadmap; do not describe the entire tutorial baseline as original work.
- Every quality, security, performance, or deployment claim must be supported by actual code, configuration, or measurement.

## Common Commands

Commands currently available:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

`npm test`, `npm run typecheck`, and E2E commands do not yet exist. They may be added to this section and used in CI only after the corresponding ROADMAP milestone introduces their scripts.

## GitHub Delivery Workflow

### Roles

- ChatGPT: planning, architecture discussion, task definition, and final code review.
- Codex: implementation, testing, Git operations, handoff documentation, and Pull Request creation.
- GitHub: the source of truth for code history, branches, commits, diffs, Pull Requests, and delivery.
- Human: the final decision-maker; only a human may decide to merge a Pull Request.

### Before Implementation

For every implementation task:

1. Run `git status`, preserve and avoid unrelated existing work, and never overwrite, discard, or reset it.
2. Update local `main` with fast-forward-only operations: run `git fetch origin --prune`, confirm the state, then run `git pull --ff-only`. If a dirty worktree prevents a safe update, stop and report it; do not force an overwrite.
3. Do not implement directly on `main`. Create a dedicated branch such as `task/<task-number>-<short-description>`; for example, `task/003-supabase-settings`.
4. Read `AGENTS.md`, `ROADMAP.md`, and the most relevant `docs/handoff/` file before understanding the code and task.
5. Before coding, clearly record the Goal, In scope, Out of scope, and Acceptance criteria. Scope expansion requires explicit approval.
6. Implement only what the task requires. Do not mix in unrelated refactoring, formatting, dependency upgrades, or architecture changes.
7. Run the applicable verification (tests, lint, typecheck, build, and targeted runtime checks). Do not report an unrun check as passed.
8. Before committing, review the final Git diff: changed files, scope, secrets/credentials, generated/local files, and acceptance criteria.

### Handoff

Every meaningful implementation task must create a concise file in `docs/handoff/`:

`docs/handoff/task_<number>_<short_description>.md`

The file must contain:

```text
# Task

## Goal

## Changed

## Not Changed

## Verification

## Risks / Notes

## Next
```

A handoff is an accurate summary for the next Codex session and ChatGPT review. It does not replace proper code, tests, commit history, or a Pull Request description. Its content must match the actual Git diff and repository history.

### Commit, Pull Request and Completion Report

After implementation and verification:

1. Review the diff and `git add` only the intended files.
2. Commit the task with a clear commit message.
3. Push the task branch to GitHub and create a Pull Request targeting `main`; Codex must not merge it.
4. The completion report must include the task, branch name, commit hash, Pull Request URL, changed files, actual verification, handoff file path, and known risks/unresolved issues.

The human sends the Pull Request to ChatGPT for independent review, then makes the final merge decision.

## Codex Working Rules

1. **Plan major changes first:** before any multi-file refactor, architecture change, dependency addition, TypeScript migration, database change, authentication change, or major feature, provide a short implementation plan.
2. **Follow ROADMAP order:** follow `ROADMAP.md`: Phase 1 regression safety/CI must precede Phase 2 TypeScript migration. Do not skip prerequisites because later phases seem more interesting.
3. **Address one milestone at a time:** keep changes reviewable, understandable, and reversible.
4. **Understand existing code before editing:** do not replace a working implementation without understanding the purpose of its existing abstraction.
5. **Verify every completed milestone:** run the relevant build, lint, tests, typecheck, and application verification.
6. **Do not claim that something should work:** if it could not be verified, explicitly state what was not verified and why.
7. **Do not add technology for a resume:** every new dependency or technology requires a clear engineering reason.
8. **Do not rewrite the whole project casually:** unless there is an exception with a written reason, prefer incremental improvement.
9. **Do not invent results or performance data:** resume metrics must come from actual measurement and retain reviewable evidence.
10. **Update documentation:** after completing a milestone, check off ROADMAP items and update `Decisions & Gotchas` when needed; update this file when architecture rules change. The recruiter-ready phase must confirm the real deployment target before removing the other platform's stale configuration.
11. **Analyse uncertainty first:** when multiple reasonable options exist, explain the trade-offs before choosing.
12. **Keep scope:** modify only this repository unless a human explicitly expands the scope. Do not modify the sibling `21-the-wild-oasis-website` repository without explicit authorization.
