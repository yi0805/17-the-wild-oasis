# Task

030 — Presentational and theme TypeScript foundations

Branch: `task/030-presentational-theme-typescript`

Base main SHA: `82bc0b04adfb9b1a95d2f5a2187b832d59f863f8`

## Goal

Convert the remaining active theme, utility, hook, global-style, and shared presentational foundations to TypeScript while preserving public APIs and runtime behaviour.

## Changed

- Files: `ROADMAP.md`; `src/main.jsx` (one approved import-extension change only); `src/context/DarkModeContext.ts`, `DarkModeProvider.tsx`; `src/hooks/useLocalStorageState.ts`, `useMoveBack.ts`; `src/utils/helpers.ts`, `constatns.ts`; `src/styles/GlobalStyle.ts`; `src/ui/AppLayout.tsx`, `Button.tsx`, `ButtonGroup.tsx`, `ButtonIcon.tsx`, `ButtonText.tsx`, `DarkModeToggle.tsx`, `DataItem.tsx`, `Empty.tsx`, `ErrorFallback.tsx`, `FileInput.tsx`, `Flag.tsx`, `Form.tsx`, `FormRow.tsx`, `FormRowVertical.tsx`, `Header.tsx`, `HeaderMenu.tsx`, `Heading.tsx`, `Input.tsx`, `Logo.tsx`, `MainNav.tsx`, `Row.tsx`, `Sidebar.tsx`, `Spinner.tsx`, `SpinnerMini.tsx`, `Tag.tsx`, and `Textarea.tsx`; `src/context/DarkModeProvider.test.jsx`; `src/ui/FormRow.test.jsx`; `src/ui/ErrorFallback.test.jsx`; and this handoff.
- Renamed all 34 approved runtime foundation files from JavaScript/JSX to TypeScript/TSX. The existing misspelled `constatns` filename remains unchanged.
- Dark Mode context explicitly provides `isDarkMode`, its React state setter, and `toggleDarkMode`; its undefined context guard remains. The provider retains system-preference fallback, saved preference, document root class updates, and class removal.
- `useLocalStorageState` is generic and returns `[T, Dispatch<SetStateAction<T>>]`. Its local `JSON.parse(...) as T` is documented because localStorage is an unvalidated runtime boundary; malformed stored JSON retains the prior throwing behaviour rather than being silently changed.
- Native controls retain their HTML attribute/event contracts through styled native elements. Button accepts native button props plus the existing `small`/`medium`/`large` and `primary`/`secondary`/`danger` visual variants with the same defaults. Form retains native form props plus the existing `regular`/`modal` visual type. Heading retains its typed h1–h4 polymorphic `as` use.
- FormRow and FormRowVertical accept ReactNode children but narrow with `isValidElement` before reading an optional child id, preserving safe label-control association and error rendering. Row preserves its existing vertical default through CSS fallback.
- ErrorFallback uses the package `FallbackProps` contract and safely displays the error value while retaining its reset action.
- Added focused DarkModeProvider, FormRow, and ErrorFallback tests (three behaviours). Existing feature tests continue to cover native controls and presentation composition indirectly.
- Added the Task 030 roadmap record. Phase 2 is explicitly not marked complete.

## Not Changed

- `App.jsx` remains unchanged. `main.jsx` was not migrated or otherwise altered beyond the approved `ErrorFallback` import extension removal.
- Pages, AddCabin, services, data hooks, generated types, Task 029 interactive primitives, dependencies, routing architecture, Supabase/Auth/RLS/Storage configuration, migrations, tests outside the three new focused files, and legacy/tutorial files were not changed.
- No hosted Supabase or authenticated browser verification was performed.

## Verification

- `npm ci` passed, with existing transitive dependency deprecation warnings.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 28 test files / 108 tests.
- `npm run build` passed. The existing large-chunk warning remains (974.02 kB minified / 279.41 kB gzip).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only offered remediation is the intentionally deferred breaking `react-router-dom` 7.18.3 upgrade.

## Risks / Notes

- Scope deviation: the user approved exactly one `src/main.jsx` line, changing only `./ui/ErrorFallback.jsx` to `./ui/ErrorFallback`, because the approved `ErrorFallback.tsx` rename otherwise prevents Vite from building. `App.jsx` is unchanged.
- Phase 2 is NOT yet complete. App, main conversion, active pages, AddCabin, the final production-JavaScript inventory, and tsconfig closeout remain for Task 031.

## Next

Task 031 should migrate the application shell entry/page wrappers and AddCabin, reassess the remaining production-JavaScript inventory and tsconfig, and only then determine whether Phase 2 can be completed.
