# Task

053 — Dashboard duration-chart responsive composition

## Goal

Fix the final concrete narrow-screen defect found during the post-Task-052 responsive/accessibility audit without changing Dashboard data, calculations, query behaviour, or unrelated feature surfaces.

Base `main` SHA: `32a0648f8b8fe11111cb396c4f4ca01dd8a307b6`.

## Audit evidence

At phone width the application shell uses `2rem` horizontal main padding. On a 320px viewport that leaves roughly 280px for feature content. Before this task `DurationChart` then used `2.8rem` card padding, a fixed `outerRadius={110}` pie (220px diameter), and a Recharts legend permanently positioned on the right with `width="30%"` and `layout="vertical"`.

Those constraints cannot share the remaining phone-width chart area cleanly: the fixed pie alone consumes almost all available inner width before the right-side legend is considered. This is a structural responsive defect rather than a subjective visual preference.

The same audit rechecked the other previously identified responsive boundaries. The app shell/navigation, shared forms, Dashboard grid/Today Activity, and booking detail/check-in surfaces have dedicated narrow-screen handling from Tasks 041 and 050–052. Booking/cabin tables intentionally retain their own horizontal-scroll strategy. The Sales chart already uses `ResponsiveContainer` and does not impose a fixed chart width.

## Changed

- Removed the Recharts-managed fixed right-side legend from `DurationChart`.
- Added a semantic legend rendered from the same prepared duration data as the pie.
- Desktop keeps a chart-plus-right-legend composition.
- At `700px` and below the legend moves below the pie and becomes a two-column wrapping list.
- The pie now uses percentage-based inner/outer radii and centered coordinates so it scales with its responsive container instead of requiring a fixed 220px diameter.
- Mobile card padding and chart height are reduced slightly to preserve usable chart width without hiding any duration category.

## Preserved

- Duration bucketing and values are unchanged.
- Light/dark chart colours are unchanged.
- Dashboard queries, loading/error/empty states, date ranges, Sales chart data, Stats calculations, Today Activity, routing, mutations, Supabase, dependencies, and backend policy are unchanged.
- No viewport JavaScript or new dependency was introduced; the responsive composition remains CSS-driven.

## Verification

This task changes presentation only. Existing Dashboard behavioural tests remain the regression gate; no fake jsdom pixel/layout assertion is added because jsdom does not perform browser layout.

Exact-head PR CI must pass `npm ci`, lint, typecheck, tests, and build. Vercel Preview must also succeed before merge review.

## Next

After merge, perform a documentation-only merged-state closeout. If no new concrete high-value responsive/accessibility defect appears, mark the remaining Phase 4 roadmap item complete, update the README limitation text, and record the current test count from exact CI evidence.
