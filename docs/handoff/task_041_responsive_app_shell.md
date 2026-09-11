# Task

041 — Harden the responsive app shell and primary navigation

## Goal

Make the authenticated AppLayout usable at tablet and mobile widths without redesigning feature pages, wide data tables, or existing modal/menu systems.

## Changed

- Base `main` SHA: `62bcfdb09c62e3f04166813e86a18d247f7b4517`.
- Added one structural shell breakpoint at `900px`, chosen because the existing fixed `24.8rem` sidebar prevents useful main-content width below that point. The existing desktop-only 1100px padding adjustment remains.
- Above 900px, the grid retains the 24.8rem Sidebar, Header placement, and desktop Main spacing. The Header toggle is hidden.
- At or below 900px, the Sidebar is removed from the visible grid, Main occupies the single content column with `2rem` horizontal padding, and shell/content `min-width` constraints prevent the shell from creating horizontal overflow. `100dvh` follows the existing `100vh` declaration as a modern viewport-height fallback.
- AppLayout owns local, initially closed navigation state. When open, it conditionally renders a normal-flow panel below Header containing the existing MainNav component; no modal, drawer, global state, persistence, or duplicated navigation implementation was added.
- Header has a compact `HiOutlineBars3` button with the stable accessible name `Toggle navigation`, state-matched `aria-expanded`, and `aria-controls="primary-navigation"`. Existing avatar/account controls remain and their visible account-name width is constrained on narrow screens to protect the Header layout.
- A document Escape listener exists only while the panel is open. Escape closes the panel and restores focus through the real Header-toggle ref. A pathname effect closes the panel after route navigation.
- Added four routed AppLayout behavioural tests. They exercise disclosure state, Escape/focus restoration, route-change closing, and the existing four primary destinations without asserting CSS media-query rendering.
- Updated the Phase 4 roadmap entry and README test count.

## Not Changed

- Table architecture, its deliberate internal 90rem horizontal overflow boundary, booking/cabin row layouts, dashboard layouts/charts, form layouts, Modal, Menus, data hooks/services, routing destinations, dependencies, and Supabase behaviour.
- No feature-level responsive redesign or broad accessibility audit was attempted.

## Verification

- `npm ci`: passed (the install reported existing deprecation and full-development audit notices).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 29 files / 129 tests.
- `npm run build`: passed. The existing large initial-chunk warning remains (`987.73 kB` minified / `282.92 kB` gzip for the main asset).
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports two known moderate React Router v6 advisories. The available `react-router-dom@7.18.3` remediation is breaking and remains intentionally deferred.
- Real viewport/browser verification was not performed: this environment did not provide a browser viewport-inspection capability, and no browser automation dependency was added for this task.

## Risks / Notes

- CSS media-query behaviour is intentionally not tested in jsdom. The new tests select the narrow-only toggle by its accessible label and verify its state/interaction contract rather than treating jsdom as a viewport renderer.
- The narrow disclosure is a normal document-flow navigation panel, not a modal; it intentionally has no focus trap.

## Next

Continue Phase 4 with separately scoped feature-level responsive polishing, remaining query-state hardening, upload validation/Storage policy work, owned cabin-image cleanup, broader accessibility work, or measured bundle optimisation.
