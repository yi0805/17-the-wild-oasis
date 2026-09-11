# Task

051 — Dashboard mobile responsive layout

## Goal

Fix the concrete Dashboard narrow-screen defects identified after Task 050 without redesigning charts, data logic, or unrelated features.

Base `main` SHA: `43c80f262f683d97b0f3353f9d2151964650e5f8`.

## Audit evidence

At widths below `1150px`, `DashboardLayout` intentionally reduces from four columns to two. Before this task it never reduced further, so phone-width screens still inherited the two-column grid.

That interacted badly with `TodayActivity`: the card itself declared `grid-column: 1 / span 2`, which can create an implicit second grid column after the parent is changed to one column unless the child span is also reset.

Each `TodayItem` also used five fixed/minimum desktop-oriented columns (`9rem 2rem minmax(8rem, 1fr) 7rem 9rem`) plus four `1.2rem` gaps. That requires roughly `40rem` before the Today card's own horizontal padding, which is wider than common phone content widths. `TodayList` hid horizontal overflow, so the result could be clipped rather than usable.

## Changed

- At `700px` and below, `DashboardLayout` becomes a true one-column grid, removes the desktop explicit row sizing, and uses auto rows.
- Dashboard grid children receive `min-width: 0` so intrinsic content cannot force the parent wider.
- `TodayActivity` resets to the single parent column and reduces its card padding at the same breakpoint.
- `TodayItem` keeps the desktop five-column layout above `700px`, but uses named mobile grid areas below it: status, flag/guest, nights, then the existing check-in/check-out action.
- Long guest names may wrap instead of widening the mobile card.

## Preserved

- Dashboard queries, loading/error states, analytics calculations, date ranges, chart data and Recharts configuration are unchanged.
- Check-in/out routes and mutation payloads are unchanged.
- All Today Activity information and actions remain visible; nothing is hidden merely to fit mobile.
- Desktop and tablet layouts keep the existing four-column / two-column behavior.
- No dependencies, Supabase configuration, RLS/Storage policy, routing, table layout, shared form layout, or backend behavior changed.

## Verification

The implementation changes only responsive presentation and one neutral action wrapper. Existing Dashboard and Today Activity behavioral tests remain the regression gate for rendering, fallbacks, navigation, and checkout mutation payloads. No jsdom layout test is added because jsdom does not perform browser layout.

Exact-head PR CI must pass `npm ci`, lint, typecheck, tests, and build. Vercel Preview must also succeed before merge review.

## Remaining responsive work

Do not mark the full Phase 4 responsive/accessibility roadmap item complete from this task alone. After merge, re-audit other active feature surfaces (especially booking detail/check-in and chart readability) and close the roadmap item only if no concrete high-value narrow-screen defect remains.
