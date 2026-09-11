# Task

052 — booking detail and check-in mobile layout

## Goal

Fix the remaining concrete narrow-screen defect discovered during the post-Task-051 responsive/accessibility closeout audit without changing booking or check-in behaviour.

Base `main` SHA: `e17a3648c8bd1b4e5f6a7dff4677356624d826cd`.

## Audit evidence

`BookingDataBox` is shared by both Booking Detail and Check-in. Before this task its header, guest metadata row, and price/payment row were desktop-oriented horizontal flex layouts with no narrow-screen reflow. The card itself uses `overflow: hidden`, so long dates, email addresses, national IDs, cabin names, price breakdowns, or payment labels could be squeezed or clipped on phone-width screens.

The shared `ButtonGroup` is used only by Booking Detail and Check-in. It also had no wrapping behaviour, so the Booking Detail action set could exceed available mobile width.

## Changed

- `BookingDataBox` now allows intrinsic content to shrink safely and wraps long cabin/date/guest metadata instead of forcing the card wider.
- At `700px` and below, the booking header becomes a vertical stack with reduced padding.
- Guest metadata may wrap across lines; long email/ID/name content may break safely.
- The price/payment surface becomes a vertical stack on phones and the section/footer padding is reduced.
- `DataItem`, whose active usage is inside `BookingDataBox`, may wrap at the same breakpoint so observation and price-breakdown content stays readable.
- `ButtonGroup`, whose active usages are Booking Detail and Check-in, now wraps actions and left-aligns wrapped actions on phones.

## Preserved

- Booking query/loading/error/empty semantics are unchanged.
- Check-in breakfast calculation, paid confirmation, routes, checkout/check-in/delete mutation payloads, and modal behaviour are unchanged.
- Desktop booking layout remains the existing horizontal presentation.
- No Supabase configuration, RLS/Storage policy, dependencies, backend behaviour, Dashboard charts, tables, or form logic changed.

## Verification

This is responsive presentation work at shared booking UI boundaries. Existing Booking Detail and Check-in behavioural tests remain the regression gate; no jsdom pixel/layout assertion is fabricated because jsdom does not perform browser layout.

Exact-head PR CI must pass `npm ci`, lint, typecheck, tests, and build. Vercel Preview must also succeed before merge review.

## Next

After merge, perform one final responsive/accessibility audit focused on Dashboard chart readability and any remaining active feature surface. Close the Phase 4 roadmap item only if that audit finds no concrete high-value defect.