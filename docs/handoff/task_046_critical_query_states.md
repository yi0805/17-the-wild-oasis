# Task

046 — Harden critical booking, check-in, and settings query states

## Goal

Prevent high-value detail/settings workflows from presenting query failures as legitimate empty data or editable fallback values, while preserving the existing architecture and successful behaviour.

Base `main` SHA: `bc3b128438cb233e31143319eb27331ba58a56c5`.

## Changed

- `BookingDetail` now consumes the existing `useBooking().error` value and renders the shared `QueryError` before the existing empty state. Loading remains highest priority and now has an accessible `Loading booking` status label.
- `CheckinBooking` now distinguishes booking-query and settings-query failures. Loading remains highest priority; booking failure is rendered before settings failure; the existing legitimate no-booking empty state remains after query errors.
- `UpdateSettingsForm` now renders the shared Settings query error instead of continuing to editable empty-value fallbacks when `getSettings` fails. Nullable values from a successful query still retain the existing neutral input fallback.
- Reused the existing `src/ui/QueryError.tsx`; no new state abstraction or dependency was added.
- Added behavioural regressions for booking-detail loading/error/empty precedence, booking and settings failures in check-in, and settings-form query failure.

## State Priority

For the changed workflows, query-state precedence is now explicit:

1. loading;
2. query error;
3. legitimate missing/empty data where the workflow already supports it;
4. successful content.

## Not Changed

- No query keys, query functions, retry policy, mutations, Supabase services, authentication boundary, routing, Dashboard query handling, responsive layout, dependencies, or backend policies changed.
- This task does not claim all application query states are globally standardised. The Phase 4 roadmap item should remain globally incomplete until remaining workflows are separately justified and reviewed.
- No `supabase db push`, dependency upgrade, React Router upgrade, or audit auto-fix is part of this task.

## Verification

The exact-head pull-request CI is the authoritative execution environment for this connector-created change. It must pass:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Also review the PR diff for whitespace/scope consistency and confirm Vercel Preview succeeds. Do not treat this task as merge-ready until those checks complete successfully.

## Next

Review the Task 046 pull request and exact-head checks. Do not merge automatically.
