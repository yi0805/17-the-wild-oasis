# Task

048 — Harden authenticated-user query failure boundary

## Goal

Keep authentication-query failures distinct from a confirmed signed-out state so protected navigation never redirects to `/login` merely because Supabase Auth could not be queried.

Base `main` SHA: `7ddd442538bf4865aa03571c11d4eca7b2033d0c`.

## Changed

- `getCurrentuser` now checks the result of `auth.getSession()` and throws its error instead of treating a failed session lookup as no session.
- A successful session lookup with no session still returns `null` and remains the only normal signed-out result from this service path.
- Existing `auth.getUser()` failures for an active session continue to throw.
- `useUser` now exposes the TanStack Query `error` value.
- `ProtectedRoute` redirects only after loading/fetching has finished, no authenticated user exists, and there is no query error.
- Initial or cached-unauthenticated Auth query failures now render the shared `QueryError` instead of redirecting to `/login`.
- A previously verified cached authenticated user remains usable if a later background Auth refetch fails; the failed refetch does not replace verified protected content with an error or login redirect.
- Added service and protected-route regressions for session lookup failure, confirmed no-session state, active-session user lookup failure, initial query failure, cached unauthenticated refetch failure, and cached authenticated refetch failure.

## State Semantics

The protected-route boundary now distinguishes:

1. initial loading → full-page loading status;
2. confirmed authenticated user → protected content;
3. Auth query failure without verified authenticated data → explicit account load error;
4. confirmed successful no-session result → redirect to `/login`;
5. background refetch failure with verified cached authenticated data → preserve protected content.

This keeps the UI navigation boundary conservative without changing Supabase RLS or Storage authorization. `ProtectedRoute` remains a client-side navigation guard, not a security boundary.

## Not Changed

- No login mutation, logout mutation, profile mutation, query key, retry policy, router structure, Supabase policy, RLS, Storage policy, dependency, or backend configuration changed.
- No custom RBAC or staff/admin role model was introduced.
- No `supabase db push`, dependency upgrade, React Router upgrade, or audit auto-fix is part of this task.

## Query-State Audit Note

The active production TanStack Query hooks are the booking list/detail, cabins, settings, dashboard recent bookings/stays, today activity, and authenticated-user queries. Tasks 038, 046, 047, and 048 now cover their important loading/error/empty or auth-state boundaries. Historical tutorial residue such as `CabinTable-v1.jsx` is not part of the active production graph.

The Phase 4 roadmap checkbox is intentionally not changed in this task; roadmap closeout can make the final completion claim after the merged state is re-audited.

## Verification

The exact-head pull-request CI is the authoritative execution environment. It must pass:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Also confirm Vercel Preview succeeds, the final PR diff remains scoped to the Auth query boundary, and `main` has not moved before merge review.

## Next

Review the Task 048 pull request and exact-head checks. Do not merge automatically.
