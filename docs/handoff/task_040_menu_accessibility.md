# Task

040 — Harden action-menu accessibility and keyboard behaviour

## Branch

`task/040-menu-accessibility`

## Base main SHA

`3b45b0b0fe80a6399d90fdab55490ab8e5dbecf4`

## Goal

Give the shared action-menu primitive accessible semantics and predictable keyboard/focus behaviour while preserving its visual design, portal positioning, mouse interactions, and generic composition with Modal.

## Changed

- `Menus.Toggle` now requires a purpose-specific `ariaLabel`. Active production call sites provide `Booking actions` and `Cabin actions`; no raw record IDs are used as user-facing labels.
- Toggles expose `aria-haspopup="menu"` and state-matched `aria-expanded`. Open lists use `role="menu"`; action buttons use `role="menuitem"`; their list wrappers use `role="none"`.
- Native Enter and Space activation remain intact. ArrowDown opens and focuses the first action; ArrowUp opens and focuses the last action.
- Within an open menu, ArrowDown/ArrowUp wrap across enabled menu items and Home/End move to the first/last item.
- Escape is listened for only while a menu is open, closes it, and restores focus to the saved persistent toggle.
- Tab and Shift+Tab do not trap focus: they close the menu without preventing browser traversal. The persistent toggle is focused immediately before dismissal so traversal continues from a connected element; jsdom reports `<body>` after the dismissal, and the focused regression verifies subsequent normal traversal reaches the toggle and then an outside control.
- Mouse action selection first makes the persistent toggle the logical focus target, runs the caller callback, then closes the menu. This lets Modal's existing active-element fallback retain the toggle rather than the soon-unmounted menu item. A real Menus + Modal test verifies modal Escape returns focus to that toggle.
- Outside clicks close without forcing toggle focus, so the clicked outside control retains focus.
- `Menus.Button` does not currently implement a disabled-action API. Navigation defensively skips native disabled menuitem controls without expanding that API in this task.

## Not Changed

- Menu portal positioning, visual styling, the one-open-ID model, booking/cabin actions, navigation, mutations, queries, or Modal implementation.
- Responsive/mobile work, broad application accessibility auditing, form accessibility, query-state work, upload validation, Storage/policy work, cabin-image cleanup, bundle optimisation, or dependencies.

## Verification

- `npm ci`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 28 test files / 125 tests.
- `npm run build`: passed; the existing large initial-chunk warning remains.
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports two known moderate React Router v6 advisories. The available `react-router-dom@7.18.3` remediation is breaking and intentionally deferred.

## Risks / Notes

- This task improves only the shared action-menu primitive. It does not claim WCAG conformance, complete keyboard coverage across the application, or responsive accessibility.
- The Tab regression documents jsdom's focus result after synchronously removing a portal; the implementation intentionally does not prevent default or trap focus.

## Next

Continue Phase 4 only through separately scoped responsive workflows, remaining query-state hardening, broader accessibility auditing, upload validation, cabin-image ownership cleanup, or measured bundle optimisation.
