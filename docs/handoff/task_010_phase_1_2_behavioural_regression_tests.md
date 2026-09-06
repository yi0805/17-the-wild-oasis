# Task

010 — Phase 1.2 behavioural regression tests

## Goal

Protect high-value rendered cabin-form and booking check-in behaviour while retaining the application's real React Hook Form, TanStack Query, application hooks, and React Router interactions.

Branch: `task/010-phase-1-2-behavioural-regression-tests`

Base main SHA: `f949be57cf8c3e7c8bc12b12796575dc8af571ef`

## Changed

- Added the development-only dependency `@testing-library/user-event` 14.6.1 for browser-like rendered interaction. It is compatible with the existing React 18, React Testing Library 14, Vitest 0.34, and Vite 4 versions and does not enter the production bundle. It was added instead of manually dispatching DOM events so UI tests exercise user-facing interactions.
- Added `src/test/renderWithProviders.jsx`, a small shared helper that creates a fresh `QueryClient` for every render with query and mutation retries disabled. It optionally supplies a real `MemoryRouter`; the enabled React Router future flags remove test-only migration warnings.
- Extended the shared jsdom setup with a minimal `matchMedia` implementation required by the real `react-hot-toast` renderer.
- Added seven `CreateCabinForm` behavioural tests using real React Hook Form and the real `useCreateCabin`/`useEditCabin` mutation hooks:
  - an empty create submit shows required validation and makes no mutation;
  - capacity and regular-price values below one are rejected without a mutation;
  - discount above regular price shows `Discount must be less than regular price` and makes no mutation;
  - a valid create without an image is blocked;
  - a valid create submits the selected `File` and current string-valued number fields to `createEditCabin`, then closes after success;
  - a failed create keeps the form open and renders the real toast message;
  - edit mode populates existing values, preserves an existing image URL without a replacement file, submits the cabin ID, and closes only after success.
- Added five `CheckinBooking` behavioural tests using real `useBooking`, `useSettings`, and `useChecking` hooks plus real `MemoryRouter` navigation:
  - an unpaid booking requires payment confirmation before the check-in button is enabled;
  - a confirmed check-in without breakfast calls `updateBooking` with exactly `status: "checked-in"` and `isPaid: true`, then navigates to the success route;
  - adding breakfast displays the concrete $90.00 increment and $690.00 total, then submits `hasBreakfast`, `extrasPrice: 90`, and `totalPrice: 690`;
  - changing breakfast clears payment confirmation and disables check-in again;
  - a failed check-in keeps the current route, renders the real error-toast message, and does not navigate.
- Updated `ROADMAP.md` to mark the completed Phase 1.2 behavioural-test item only; Phase 1 CI remains incomplete.

The rendered tests mock only the data-access modules: `createEditCabin` from `apiCabins`, `getBooking` and `updateBooking` from `apiBookings`, and `getSettings` from `apiSettings`. They do not mock React Hook Form, TanStack Query, React Router, `useCreateCabin`, `useEditCabin`, `useBooking`, `useSettings`, or `useChecking`. No test imports the real Supabase client, requires environment configuration, or accesses hosted Supabase data.

## Not Changed

- No production component, hook, service, Supabase policy, Auth configuration, environment configuration, or application behaviour changed.
- No GitHub Actions workflow, TypeScript/typecheck, Playwright, Cypress, coverage target, or unrelated dependency upgrade was added.
- Task 009's service tests and testing configuration remain in place.
- The known successful old-cabin-image replacement cleanup limitation remains deferred.

## Verification

- `npm ci` passed. npm printed existing transitive deprecation warnings and a full-install audit summary, but completed from the lockfile.
- `npm run lint` passed with zero warnings.
- `npm test` passed: 4 test files and 19 tests. This includes the original 2 Task 009 service files / 7 tests plus 2 Task 010 behavioural files / 12 tests.
- `npm run build` passed. The existing Vite large-chunk advisory remains; the main chunk is 966.63 kB minified / 277.13 kB gzip.
- `git diff --check` passed.
- `npm audit --omit=dev` completed with 2 moderate React Router v6 advisories. npm's only fix is the out-of-scope breaking upgrade to `react-router-dom@7.18.3`; this matches the existing documented risk.

## Risks / Notes

- On create, React Hook Form enforces the image requirement, but `CreateCabinForm` does not pass `errors.image` into its `FormRow`, so no inline image validation message is currently displayed. The Task 010 test protects the existing blocked-submit behaviour without changing production UX; consider this in a future, explicitly scoped form UX task.
- Error-toast tests assert the real toast message is rendered in jsdom's live region rather than asserting CSS animation visibility.
- Fixtures include the booking fields consumed by the real `BookingDataBox`; no child component or application hook was replaced to make the tests pass.

## Next

Task 011 — Phase 1.3 GitHub Actions CI. Add a pull-request workflow that runs the now-existing `npm ci`, lint, test, and build commands. Do not add typecheck until Phase 2.
