# Task

050 — responsive form layout

## Goal

Fix the first concrete feature-level narrow-screen defect found after Task 049 without turning Phase 4 into a broad responsive redesign.

Base `main` SHA: `a1eb4f1901e34c5a59ce8b4fd9b6435c43bbcfc1`.

## Audit evidence

Task 041 made the authenticated app shell responsive at 900px, but feature content still needed a separate audit.

The shared active `FormRow` used three columns with minimum widths of `18rem`, `18rem`, and `12rem`, plus two `2rem` gaps. That establishes a minimum row requirement of about `52rem` before the regular form's own horizontal padding. On phone-width content this cannot fit. Because the regular `Form` also uses `overflow: hidden`, controls or validation content can be squeezed or clipped instead of reflowing.

This active primitive is used by the cabin create/edit form, settings form, account profile form, and password form, so the defect affects multiple important authenticated workflows.

The responsive audit also checked the shared table strategy. `Table` intentionally keeps a `90rem` inner minimum width but provides `overflow-x: auto` on its own surface, so horizontal scrolling is an explicit containment strategy rather than evidence of page-level overflow. It is not changed here.

Dashboard still has separate narrow-screen pressure: below 1150px its aggregate grid remains two columns, while stat cards and Today Activity retain desktop-oriented internal grids. That should be handled as an independent evidence-based task rather than bundled into the form fix.

## Changed

- At `700px` and below, active `FormRow` content now reflows from the desktop three-column label/control/error grid to one column.
- Direct form-row children can shrink with `min-width: 0`, preventing intrinsic control/content width from defeating the grid.
- Button rows keep their existing right-aligned desktop behaviour and may wrap on narrow screens instead of overflowing.
- Regular forms reduce horizontal padding from `3.2rem` to `2rem` at the same breakpoint to preserve usable control width.

## Preserved

- Desktop form layout remains the existing three-column design.
- Label/control associations, validation rendering, React Hook Form behaviour, mutations, query state, and modal form width are unchanged.
- No feature markup, data/service code, Supabase configuration, dependencies, or routing changed.
- Tables keep their existing local horizontal-scroll behaviour.

## Verification

This task is CSS-only at the shared presentation boundary. Existing behavioural tests remain the regression suite for label association, cabin/settings/account/password workflows; no layout assertion is fabricated in jsdom, which does not perform browser layout.

Exact-head PR CI must pass `npm ci`, lint, typecheck, tests, and build. Vercel Preview must also succeed before merge review.

## Next

Re-audit Dashboard at narrow widths as a separate task. Do not mark the full Phase 4 responsive/accessibility roadmap item complete from this form fix alone.
