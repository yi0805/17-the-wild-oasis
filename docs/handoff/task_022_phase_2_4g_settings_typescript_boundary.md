# Task

022 — Phase 2.4g Settings TypeScript boundary

## Goal

Migrate the active Settings form boundary to TypeScript while preserving its blur-update workflow and ensuring numeric UI values reach the typed service as numbers.

Branch: `task/022-phase-2-4g-settings-typescript-boundary`

Base main SHA: `36ce0cf6e7e5169d3d40dc3e19b32be9dea96756`

## Changed

- Renamed `UpdateSettingsForm` to `.tsx` and derived its result/update contracts from the typed settings service.
- Restricted the form to its four existing editable fields and typed blur events as HTML number-input events.
- Nullable generated settings values now display as empty inputs; empty or non-finite DOM values do not mutate, while valid numeric values—including `0`—cross the mutation boundary as numbers.
- Preserved the existing loading spinner, blur updates, and pending-mutation disabled inputs.
- Added six behavioural tests using the real settings query/mutation hooks while mocking only the settings service: existing values, nullable fallback, number conversion, zero, empty input, and pending disabled state. The suite is 9 files / 49 tests.
- Recorded this completed boundary in `ROADMAP.md`.

## Not Changed

- No settings service or hook, generated database type, shared UI component, Supabase configuration, dependency, route, authentication code, or unrelated feature boundary changed.

## Verification

- `npm ci` passed (with existing deprecation warnings from transitive development dependencies).
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 9 files / 49 tests.
- `npm run build` passed. The existing large-chunk warning remains (971.67 kB minified / 278.65 kB gzip main bundle).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only available fix is the breaking Router v7 upgrade, which is out of scope.

## Risks / Notes

- The legacy JavaScript `FormRow` component infers all destructured props as required to TypeScript consumers. This boundary passes `error={undefined}` to preserve its existing no-error behaviour without expanding the task to migrate shared UI typing.

## Next

Review the remaining settings, authentication, and shared-UI TypeScript boundaries before defining the next Phase 2 task.
