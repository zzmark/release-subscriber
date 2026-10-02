## @hyperdx/app@2.40.0

### Minor Changes

- 8a9fcd2f: feat: Support macros in PromQL charts
- 08d9a908: feat: Plot several PromQL expressions on one chart
- d9e2c58b: Add a per-source floor for auto granularity. A metric source can now set "Minimum auto granularity" (Team Settings → Sources → your Metrics source) so that auto-inferred time buckets never go below it — useful when the underlying metric is reported on a fixed interval (e.g. a 60s scrape), since a short selected date range can otherwise auto-infer a smaller bucket than that interval and render a sparse/steppy series (alternating real-sample/empty buckets). Mirrors Grafana's per-datasource "Min interval" setting. Unset (the default) preserves the existing unfloored behavior, and an explicit (non-auto) granularity chosen on a tile is never affected.
- d76cb7ed: Add a "Trace logs" tab to the event side panel, listing the trace's logs as a flat chronological table over the same time window the waterfall uses. It appears on any row that carries a trace id and resolves a log source — a span (via the trace source's correlated log source) or a log (its own source). Previously the only route to a trace's logs was hunting for the green rows interleaved in the waterfall, which a log-heavy trace buries.

  The tab lists the trace unfiltered; "Open in search" hands the same query — same source, same trace, same window — to the search page for anything narrower. Picking a log opens it in the panel: a breadcrumb hop from a span, or a row change from another log. Sorting is ascending, which inside a trace is execution order.

- f800b090: Add a Preferences → Search results → Row click setting. Leave it at `Open side
panel` (the default) for the existing behavior, or set it to `Expand inline` to
  have a row click expand the row in place — the chevron's 16px hit target is hard
  to aim at while scanning logs. With inline expansion on, the side panel moves to
  a hover button on the row, stays one click away from an expanded row, and keeps
  receiving row clicks while it is open.

### Patch Changes

- 416c92a0: fix: stop discarding chart axis-tick decimals for large numbers

  Axis ticks at or above 1k were always rounded to a whole number regardless of the configured Number Format, so nearby values (e.g. 950 and 1080) could both render as `1k` — ticks now use as much precision as the axis's width allows, on both the web app and CLI terminal charts. Also fixed: a tightly fit Y-axis could show two ticks with the identical rounded label.

- 1e355ac4: fix: don't scan the whole table to discover Map keys

  `getMapKeys` only applied a time predicate when the caller passed both a date
  range and a timestamp expression; otherwise the raw `sampledKeys` scan ran with
  no `WHERE` and touched every part of the table. It now defaults a missing date
  range to the last 24 hours and skips the raw scan entirely when there is no
  timestamp expression to filter on. The chart, alert and dashboard-filter
  editors pass the source and date range they already have so Map keys keep
  autocompleting there.

- ec25b813: fix: Only offer PromQL sources in the chart editor's PromQL mode
- c47b9b9e: fix: rework the dashboards list with tabs, sort, and tag filtering

  Tagged dashboards no longer repeat under every tag they carry — the grid lists
  each dashboard once. Tags are now a filter behind a fixed-width Tags button
  with a count badge (a dashboard must carry every selected tag). Favorites
  moved from a pinned row of cards into an "All /
  Favorites / My dashboards" tab strip, and a sort control offers last updated
  (default), name, and recently created. Import and New dashboard moved into the
  page header.

- 5e3031da: fix: show that number, bar and pie tiles are refreshing

  During a dashboard refresh these tiles kept the previous result on screen with
  no sign that new data was loading, so stale values looked current. They now
  pulse while the refetch runs, like line and stacked-bar time charts already do.

- 517ffd90: fix: keep heatmap tiles on screen while a dashboard refreshes

  During a refresh, heatmap tiles replaced the chart with a "Loading..." message
  until the new data arrived. They now keep the current heatmap on screen and
  pulse while the refetch runs, like the other dashboard tiles.

- 6452baaf: fix: expand live tail time picker presets to 6h and clarify switch label

  Enable 3h and 6h presets in live tail mode (previously capped at 1h in the picker, though longer ranges already worked via URL). Ranges above 6h remain disabled because the refresh tick (10s default) re-queries the full window, and 12–24h scans would be excessive. Rename the toggle switch from "Relative Time" to "Live tail ranges" to clarify that it controls which preset intervals are available, not whether live tail is active. Add a "Not available for Live Tail" tooltip to disabled presets (12h+).

- 0c93eab0: fix: label Map attribute columns added from the search sidebars by their key

  Adding a Map attribute such as `ResourceAttributes['service.name']` as a column
  from the filters sidebar or the row side panel now writes it into the SELECT as
  `ResourceAttributes['service.name'] AS "service.name"`, so the results column
  reads `service.name` instead of
  `arrayElement(ResourceAttributes, 'service.name')`. The alias is visible and
  editable in the SELECT, and queries typed by hand are not changed. A key named
  like a table column, or one already used as a name in the SELECT, is added
  without an alias.

- 793fe19e: feat: Substitute dashboard variables in markdown tiles
- ec4f5087: fix: allow grouping gauge and sum metric charts by materialized and alias columns

  Grouping or selecting a MATERIALIZED or ALIAS column on a gauge or sum metric chart failed with `Unknown expression identifier`, because the intermediate query didn't carry those columns through.

- 4fa3c376: Fix search results going blank after expanding and collapsing rows. A row and
  its inline expansion are two `tr`s sharing one virtual index, and both were
  measured by the virtualizer, so the expanded row took over that index's
  ResizeObserver registration and left its height cached there after it
  collapsed. Each expand/collapse shrank the render window a little further until
  scrolling showed only a handful of rows above empty space. The row and its
  expansion are now wrapped in a `tbody` that is measured as one unit.
- bd40e3cb: fix(app): stop event deltas selection failing on Distributed tables
- a8a72c11: fix: Support instant queries and reductions on PromQL number tiles
- 8cfb2672: feat: Support background sparklines on PromQL range number tiles
- 4570d5ee: feat: Support pie and bar tiles on PromQL sources
- 78ed5921: feat: Support table tiles on PromQL sources
- 23423c13: fix: Show distribution only labels a value "<1%" when the sample shows it is rare, not when it has no matching rows, and shows 100% when the field's filter allows only that value
- 5bdb68db: feat: add an option to show MATERIALIZED and ALIAS columns in the row details panel

  ClickHouse leaves MATERIALIZED and ALIAS columns out of `SELECT *`, so the row
  details panel never showed them. A new "Show materialized and alias columns"
  item in the properties view options menu, off by default, adds
  `asterisk_include_materialized_columns` and `asterisk_include_alias_columns` to
  the row query. It has no effect on a source with a Known Columns List, and a
  value that the source's query settings give for either setting wins. If the row
  fails to load while the option is on (for example, because the connection's user
  is `readonly = 1`, or an ALIAS column cannot be evaluated), the error state
  offers to turn the option off.

- 9647ad3d: fix: Apply source query settings to the row side panel's row lookup
- 4c4792f5: fix: drop the search bar WHERE label and `/` keycap overlay

  The `WHERE` label repeated the SQL placeholder, and the `/` hint clipped long queries. `/` and `s` still focus the input; the overlay is gone.

- 67673498: Fix the Search page using more and more browser memory with Live Tail on. Each
  refresh added CSS rules for the SELECT and ORDER BY editors that were never
  removed, so a tab left open could grow by gigabytes.
- c2c26093: feat: reveal search row-selection checkboxes on hover

  The multi-select checkbox now fades in when a row is hovered or the checkbox
  takes keyboard focus, instead of sitting on every row all the time, and is a
  little smaller so its column costs less horizontal room. Selecting
  any row reveals every checkbox so shift-click ranges stay aimable, and touch
  devices (no hover) keep them visible. The cell keeps its width in every state,
  so nothing reflows on hover.

- 19182e7e: fix: only split a query at a standalone SETTINGS keyword

  `extractSettingsClauseFromEnd` cut the query at the first "settings" anywhere in
  it, including inside a string or an identifier. A multi-series metric chart with
  a metric such as `app.settings.reloads` produced SQL with an unterminated
  string, and a SQL filter on a column such as `AppSettings` was rewritten to
  reference `App`. The keyword now has to stand alone outside quotes.

- 1edc042a: fix: keep table tile rows on screen while a dashboard refreshes

  A dashboard refresh cleared the table tile and showed "Loading Chart Data..."
  until the new result arrived. The tile now keeps its current rows and pulses
  while the refetch runs, like the other dashboard tiles.

- 16c7a6c3: fix: keep toolbar controls level with the first line of a wrapping query field

  Date pickers, Run, and nearby row actions stay top-aligned as a SQL or Lucene field grows. Sessions opts into PageHeader block padding so a taller search bar still has room.

- fb2aebc9: fix: set viewport initial scale to 1 so mobile browsers no longer load the app zoomed out to 75%
- e24acf73: fix: keep Y-axis ticks evenly spaced and cleanly rounded

  A chart's Y-axis could render unevenly spaced or fractional ticks (e.g. `0, 300, 1k` instead of `0, 250, 500, 750, 1k`), or even show two ticks with the identical label. Ticks now round to clean, evenly-spaced, always-distinct values instead.

- Updated dependencies [1e355ac4]
- Updated dependencies [d91e66b8]
- Updated dependencies [793fe19e]
- Updated dependencies [ec4f5087]
- Updated dependencies [8a9fcd2f]
- Updated dependencies [08d9a908]
- Updated dependencies [a8a72c11]
- Updated dependencies [8cfb2672]
- Updated dependencies [4570d5ee]
- Updated dependencies [78ed5921]
- Updated dependencies [23423c13]
- Updated dependencies [19182e7e]
- Updated dependencies [d9e2c58b]
- Updated dependencies [a5e7841c]
  - @hyperdx/common-utils@0.30.0
  - @hyperdx/api@2.40.0

## @hyperdx/otel-collector@2.40.0

### Minor Changes

- 3ab758e4: feat(otel-collector): compile in statsdreceiver

  Available for a user's own pipeline config (e.g. via
  `CUSTOM_OTELCOL_CONFIG_FILE`) to ingest StatsD/DogStatsD metrics
  directly, without a separate StatsD-to-OTLP bridge. Purely additive:
  being compiled in changes no default pipeline or behavior on its own.

## @hyperdx/common-utils@0.30.0

### Minor Changes

- 8a9fcd2f: feat: Support macros in PromQL charts
- 08d9a908: feat: Plot several PromQL expressions on one chart
- d9e2c58b: Add a per-source floor for auto granularity. A metric source can now set "Minimum auto granularity" (Team Settings → Sources → your Metrics source) so that auto-inferred time buckets never go below it — useful when the underlying metric is reported on a fixed interval (e.g. a 60s scrape), since a short selected date range can otherwise auto-infer a smaller bucket than that interval and render a sparse/steppy series (alternating real-sample/empty buckets). Mirrors Grafana's per-datasource "Min interval" setting. Unset (the default) preserves the existing unfloored behavior, and an explicit (non-auto) granularity chosen on a tile is never affected.

### Patch Changes

- 1e355ac4: fix: don't scan the whole table to discover Map keys

  `getMapKeys` only applied a time predicate when the caller passed both a date
  range and a timestamp expression; otherwise the raw `sampledKeys` scan ran with
  no `WHERE` and touched every part of the table. It now defaults a missing date
  range to the last 24 hours and skips the raw scan entirely when there is no
  timestamp expression to filter on. The chart, alert and dashboard-filter
  editors pass the source and date range they already have so Map keys keep
  autocompleting there.

- 793fe19e: feat: Substitute dashboard variables in markdown tiles
- ec4f5087: fix: allow grouping gauge and sum metric charts by materialized and alias columns

  Grouping or selecting a MATERIALIZED or ALIAS column on a gauge or sum metric chart failed with `Unknown expression identifier`, because the intermediate query didn't carry those columns through.

- a8a72c11: fix: Support instant queries and reductions on PromQL number tiles
- 8cfb2672: feat: Support background sparklines on PromQL range number tiles
- 4570d5ee: feat: Support pie and bar tiles on PromQL sources
- 78ed5921: feat: Support table tiles on PromQL sources
- 23423c13: fix: Show distribution only labels a value "<1%" when the sample shows it is rare, not when it has no matching rows, and shows 100% when the field's filter allows only that value
- 19182e7e: fix: only split a query at a standalone SETTINGS keyword

  `extractSettingsClauseFromEnd` cut the query at the first "settings" anywhere in
  it, including inside a string or an identifier. A multi-series metric chart with
  a metric such as `app.settings.reloads` produced SQL with an unterminated
  string, and a SQL filter on a column such as `AppSettings` was rewritten to
  reference `App`. The keyword now has to stand alone outside quotes.

## @hyperdx/api@2.40.0

### Minor Changes

- d91e66b8: Make the external API v2 rate limit (`/api/v2/*`) configurable via `EXTERNAL_API_RATE_LIMIT_MAX`. Defaults to 100 requests/minute, matching the previous hardcoded value.

### Patch Changes

- 1e355ac4: fix: don't scan the whole table to discover Map keys

  `getMapKeys` only applied a time predicate when the caller passed both a date
  range and a timestamp expression; otherwise the raw `sampledKeys` scan ran with
  no `WHERE` and touched every part of the table. It now defaults a missing date
  range to the last 24 hours and skips the raw scan entirely when there is no
  timestamp expression to filter on. The chart, alert and dashboard-filter
  editors pass the source and date range they already have so Map keys keep
  autocompleting there.

- 793fe19e: feat: Substitute dashboard variables in markdown tiles
- ec4f5087: fix: allow grouping gauge and sum metric charts by materialized and alias columns

  Grouping or selecting a MATERIALIZED or ALIAS column on a gauge or sum metric chart failed with `Unknown expression identifier`, because the intermediate query didn't carry those columns through.

- 08d9a908: feat: Plot several PromQL expressions on one chart
- 19182e7e: fix: only split a query at a standalone SETTINGS keyword

  `extractSettingsClauseFromEnd` cut the query at the first "settings" anywhere in
  it, including inside a string or an identifier. A multi-series metric chart with
  a metric such as `app.settings.reloads` produced SQL with an unterminated
  string, and a SQL filter on a column such as `AppSettings` was rewritten to
  reference `App`. The keyword now has to stand alone outside quotes.

- d9e2c58b: Add a per-source floor for auto granularity. A metric source can now set "Minimum auto granularity" (Team Settings → Sources → your Metrics source) so that auto-inferred time buckets never go below it — useful when the underlying metric is reported on a fixed interval (e.g. a 60s scrape), since a short selected date range can otherwise auto-infer a smaller bucket than that interval and render a sparse/steppy series (alternating real-sample/empty buckets). Mirrors Grafana's per-datasource "Min interval" setting. Unset (the default) preserves the existing unfloored behavior, and an explicit (non-auto) granularity chosen on a tile is never affected.
- a5e7841c: fix(mcp): time-bound the trace waterfall span/log fetches so they prune
  partitions instead of scanning the full retention window. The
  `clickstack_trace_waterfall` tool now threads the search window into its span
  and correlated-log queries, adds a `max_execution_time` ceiling, and probes a
  trace's `[min, max]` span extent so an explicit `traceId` older than the
  default window — or a trace that ran longer than an hour — still resolves in
  full. The probe also runs for auto-picked traces, so a picked trace whose root
  predates the window is no longer truncated into a partial tree. The fetch window
  is width-clamped to the recent tail so a reused or sentinel `traceId` (e.g. an
  all-zero id from an uninstrumented emitter) can't widen the scan back toward the
  retention edge or stitch unrelated occurrences into one tree. Empty-result hints
  now name the recoverable action (pass an explicit `startTime`) instead of the
  misleading "widen the window", and a probe that fails is surfaced rather than
  silently swallowed. ClickHouse query timeouts are also reclassified from `user`
  to `server` errors.
- Updated dependencies [1e355ac4]
- Updated dependencies [793fe19e]
- Updated dependencies [ec4f5087]
- Updated dependencies [8a9fcd2f]
- Updated dependencies [08d9a908]
- Updated dependencies [a8a72c11]
- Updated dependencies [8cfb2672]
- Updated dependencies [4570d5ee]
- Updated dependencies [78ed5921]
- Updated dependencies [23423c13]
- Updated dependencies [19182e7e]
- Updated dependencies [d9e2c58b]
  - @hyperdx/common-utils@0.30.0