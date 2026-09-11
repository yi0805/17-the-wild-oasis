# Task

039 — Harden modal accessibility and keyboard behaviour

## Branch

`task/039-modal-accessibility`

## Base main SHA

`aaacff38b58008e5c41d7f30548aa831e243e88f`

## Goal

Give the shared Modal primitive correct dialog semantics and predictable keyboard and focus behaviour without changing its compound API, visual design, or business workflows.

## Changed

- `Modal.Window` now requires an explicit `ariaLabel`. Every current cabin and booking caller supplies a purpose-specific label such as `Create cabin` or `Delete booking confirmation`; labels never expose raw implementation IDs.
- Open dialogs expose `role="dialog"`, `aria-modal="true"`, and a named icon-only `Close dialog` button.
- Opening intentionally focuses the dialog container (`tabIndex={-1}`), avoiding automatic focus on destructive confirmation actions.
- Escape closes only the currently open dialog. The document listener is registered only while that dialog is open and is cleaned up on close/unmount.
- Tab and Shift+Tab wrap among normal dialog focus targets; if none are available, focus stays on the dialog container.
- `Modal.Open` records the real opening element from its interaction when available, with `document.activeElement` as the non-selector fallback for menu button composition. The shared close path restores focus when that opener is still connected and enabled.
- `useOutsideClick` now accepts an optional enabled flag so inactive modal windows do not register click listeners. Existing menu behaviour continues to use its default enabled state.
- Expanded modal behavioural coverage from one to four tests. The full suite count is now 28 test files / 120 tests.

## Not Changed

- The Modal compound-component API shape, named-window behaviour, portal rendering, child `onCloseModal` injection, overlay, and visual styling.
- Booking/cabin mutations, forms, menus, routing, queries, Supabase, dependencies, and general page accessibility.
- Responsive/mobile work, broader accessibility auditing, file validation, Storage policy/lifecycle work, or bundle optimisation.

## Verification

- `npm ci`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 28 test files / 120 tests.
- `npm run build`: passed; the existing large initial-chunk warning remains.
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports the two known moderate React Router v6 advisories. The available `react-router-dom@7.18.3` remediation is a breaking upgrade and was intentionally deferred.

## Risks / Notes

- `aria-modal` and focus control improve the shared modal primitive only; background `inert` handling and whole-application accessibility conformance are not claimed.
- Menu item triggers can be unmounted when their menu closes, so restoration safely occurs only when the saved opener remains connected and focusable.

## Next

Continue Phase 4 through separately scoped responsive workflows, menu/dropdown accessibility, remaining query-state hardening, upload validation, cabin-image ownership cleanup, or measured bundle optimisation.
