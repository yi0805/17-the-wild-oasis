# Task

034 — Professional UI visual polish

## Branch

`task/034-ui-visual-polish`

## Base main SHA

`d23b2c71770ef5c90fab15a6f47c16d059d37731`

## Goal

Make The Wild Oasis feel like a polished hotel-operations SaaS dashboard while preserving its existing routes, workflows, application behavior, data access, and architecture.

## Visual direction

- Premium B2B SaaS with restrained boutique-hospitality character.
- Warm-neutral application surfaces with a forest-green primary color aligned to the existing hotel mark and a muted brass accent.
- Operational information density is retained; decoration remains secondary to hierarchy and clarity.

## Design-system changes

- Reworked the shared light and dark palettes into semantic application, surface, text, border, accent, focus, and action tokens while retaining compatible legacy color tokens for existing components.
- Replaced the generic page typography with a local system-font stack, strengthened page/section/metric hierarchy, and introduced tabular numeric treatment where operational values benefit from alignment.
- Normalized professional radii, restrained shadows, control heights, focus outlines, disabled states, transition timing, and form spacing.
- Added explicit light/dark `color-scheme` handling so native form controls follow the active theme.

## Key surfaces changed

- Refined the app shell, content width, header spacing, logo area, sidebar dividers, navigation active/hover states, and icon treatment.
- Restyled dashboard stat cards, activity rows, chart containers, chart grid/tooltip/legend treatment, and both light/dark chart palettes.
- Standardized tables with quieter headers, consistent rows and separators, hover feedback, compact badges, and contained horizontal scrolling at narrower desktop widths.
- Refined shared buttons, icon/text actions, inputs, selects, textareas, file controls, forms, filters, pagination, empty states, menus, modal windows, and confirmation dialogs.
- Reworked Login into a focused branded panel with the same authentication behavior.
- Refined booking detail, check-in panels, cabin imagery, monetary typography, and the header user identity treatment.

## Dark-mode verification

Local Vite rendering was inspected in headless Chrome 152 with the real theme provider and dark-mode class. Login, Dashboard, Bookings, Cabins, Settings, menu, cabin-edit modal, and delete-confirmation surfaces were inspected. Surface separation, muted text, fields, controls, statuses, images, charts, and danger-button contrast remained visible and cohesive.

## Responsive verification

- At 1440 × 1000, Dashboard, Bookings, Cabins, Settings, Account, and Login were inspected with no page overflow or clipped primary content.
- At 1024 × 900, the dashboard reflowed from four to two stat columns; activity and chart panels used the full content width.
- At 1024 × 900, bookings and cabins tables retained their dense layout inside a horizontally scrollable table surface. The document itself remained at the viewport width.
- This task does not introduce a mobile navigation or full responsive redesign.

## Changed

- Updated shared global style tokens and reusable UI primitives.
- Updated app-shell and login presentation.
- Updated dashboard, activity, booking, cabin, and check-in presentation.
- Added this narrow Task 034 history entry to `ROADMAP.md`.

## Not Changed

- No service, Supabase, Auth, Storage, query hook, mutation, query key, route, form submission, validation, pagination, filter, sort, or business-status behavior changed.
- No dependency, test file, CI, Vercel configuration, README screenshot, or hosted configuration changed.
- No recruiter screenshot was committed and Phase 3 was not marked complete.
- Phase 4 responsive and accessibility hardening was not started.

## Verification

- `npm ci`: passed with existing transitive deprecation warnings.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 28 test files / 108 tests.
- `npm run build`: passed; output was 981.82 kB minified / 281.31 kB gzip and retained the existing large-chunk advisory.
- `npm audit --omit=dev`: reported the two documented moderate React Router v6 advisories. npm still offers only the deferred breaking React Router v7 remediation.
- `git diff --check`: passed.
- Visual verification used the local Vite application and Chrome DevTools Protocol. Protected pages used representative locally intercepted Auth/REST responses; no hosted Supabase read or mutation was required. The browser recorded no uncaught exceptions, console errors, or network failures during the final page pass.

## Risks / Notes

- Visual verification is manual rather than an automated visual-regression suite.
- At 1024px, wide operational tables intentionally scroll within their bordered table surface so columns and row density are not compressed into unreadability.
- The existing production bundle-size advisory remains and is outside this task.
- The application still has no mobile navigation treatment; mobile responsive hardening remains Phase 4 work.

## Next

1. Capture and verify non-sensitive recruiter screenshots from the final deployed UI.
2. Complete the separate final Phase 3 secret, deployment-config, and documentation review.
