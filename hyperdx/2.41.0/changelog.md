## @hyperdx/app@2.41.0

### Minor Changes

- 6873416d: feat: Add a series mode to builder heatmaps
- eeabaebe: feat: Support PromQL heatmaps (series-mode)
- ff5befa8: Support "Minimum auto granularity" on PromQL sources. It floors the step of charts on auto granularity, as it does for metric sources, and `$__rate_interval` now uses it as the source's scrape interval (still 15s when unset) instead of always assuming 15s. A granularity picked on a tile is never changed.
- d8b1cdfa: feat: Attribute PromQL queries to the dashboard, tile or search that issued them, through both the `prometheusQuery`/`prometheusQueryRange` table functions and ClickHouse's Prometheus HTTP API
- ab703243: feat: attribute ClickHouse queries to the dashboard, tile, search or alert that
  issued them

  A row in `system.query_log` previously couldn't be attributed to the part of
  HyperDX that produced it. Now every query HyperDX runs has a small JSON
  `log_comment`, plus a `query_id` starting with `hdx-`.

  Attribute load after the fact:

  ```sql
  SELECT
      JSONExtractString(log_comment, 'surface') AS surface,
      JSONExtractString(log_comment, 'dashboard') AS dashboard,
      JSONExtractString(log_comment, 'tile') AS tile,
      count(),
      sum(read_rows)
  FROM system.query_log
  WHERE type = 'QueryFinish' AND log_comment != '' AND query_id like 'hdx-%'
  GROUP BY ALL
  ORDER BY sum(read_rows) DESC
  ```

  Or spot a query while it is still running, in `system.processes`, where the
  `query_id` names the surface with no JSON parsing needed.

  The payload records which part of the product asked (a dashboard, a search, an
  alert, an MCP tool, the chart explorer, session replay, field lookups, and so
  on), the dashboard and tile or saved search id, the source id, and on the server
  the trace id of the request. Field lookups and autocomplete are labelled too, so
  they can be told apart from a user's chart queries.

  The exception is queries that skip settings processing: the `system.settings`,
  server version and Cloud-detection probes, and the onboarding connection check.
  They get a `query_id` but an empty `log_comment`.

- 68082b67: feat: add stacked line (stacked area) time-series display type

### Patch Changes

- 766a3b08: feat: add `@clickhouse/click-ui` as a dependency and mount `ClickUIProvider`
  next to `MantineProvider`. The provider follows the HyperDX color mode and does
  not persist its own theme. The "open an issue on GitHub" link in error messages
  is the first component to use click-ui (`Link`).
- a986a03b: feat: use the click-ui `Badge` for alert state badges. A fired alert shows a
  solid red badge, and an evaluation error shows a light red badge.
- 46ff1fc4: feat: let users permanently dismiss the metric drill-down warning

  Drilling down from a metric chart whose source has no correlated log source
  shows a warning. Clicking its close button now hides the warning for good in
  that browser, and repeated clicks no longer stack copies of it.

- 07c93656: fix: cast FixedString columns before implicit hasToken search

  A bare search term against a FixedString column such as OTel TraceId compiled to
  hasToken(lower(TraceId), ...), which ClickHouse rejects. Those haystacks are now
  CAST to String first.

- 3e34efa0: feat: Respect explicit and minimum granularity on heatmaps
- 3615f122: fix: Match heatmap hover to the cell under the cursor
- bd0da16c: feat: Edit heatmap value and count inline in the chart editor
- 51e47b12: feat: rename dashboards and saved searches by clicking the title instead of a
  pencil button

  The name is now edited in place: Enter or clicking away saves, Escape reverts.

- 0c1dd866: feat: add optional `NEXT_PUBLIC_INSTANCE_LABEL` suffix to the tab title and sidebar

  Operators running multiple HyperDX instances (e.g. one per region) can now set `NEXT_PUBLIC_INSTANCE_LABEL` to append a short label to the browser tab title and sidebar, e.g. "HyperDX UK". Empty by default, no behavior change if unset. The sidebar label only shows when the sidebar is expanded, and replaces the UTC badge there when both are set.

- 01ea7f32: feat: choose how property keys are ordered in the row side panel

  The JSON viewer sorts keys alphabetically, which is the right default for wide
  ClickHouse `Map(...)` columns like `ProfileEvents` but hides the stored column
  order. The properties view options menu now offers "Sort keys A–Z", "Sort keys
  Z–A", and "Original order"; the choice persists with the viewer's other options.
  Array elements keep their index order in every mode. In "Original order",
  integer-like keys (e.g. HTTP status codes) still list first in ascending order,
  since parsed JavaScript objects order keys that way.

- 0b855534: fix: fall back to the Map key scan when the text index read fails

  `getMapKeys` returned an empty list whenever its `mergeTreeTextIndex` query
  failed, so the rollup and bounded `mapKeys` scan paths never ran. ClickHouse
  refuses `mergeTreeTextIndex` with `ACCESS_DENIED` on any table with a row
  policy, which left search autocomplete with no Map keys on those tables. A
  failed text index read now falls through to the next strategy. After a row
  policy denial it skips the key rollup table, which the policy doesn't cover,
  and reads keys only from the policy-filtered source table.

- 0ddfe7d7: fix: use plural source kind labels and "OTel" spelling on the Sources page

  The source form's data type options and the sources list now read Logs, Traces, OTel metrics, Sessions, and PromQL.

- e61461be: feat: auto-detect a PromQL source during onboarding

  When PromQL is enabled (`NEXT_PUBLIC_ENABLE_PROMQL=true`), onboarding source auto-detection now also creates a PromQL source for a ClickHouse TimeSeries engine table. It prefers `prometheus.metrics` (the table the ClickHouse Prometheus docs suggest), then a table named `metrics_ts`, and otherwise picks the only TimeSeries table on the connection. A service with only a TimeSeries table is no longer sent to manual source setup.

- 76e5cf78: feat: support a series limit on PromQL line, stacked bar, pie and bar charts

  The Display Settings drawer now offers Series Limit for PromQL charts. On line and stacked bar charts it keeps the top N series by peak value (leave empty for the default of 250, or set 0 for unlimited). On pie and bar charts it keeps the N largest slices or bars (leave empty to show all).

- 1be9de8f: feat: Add a promql variable format that escapes based on single/multi-select
- c372a71c: fix: pulse the list-bar and histogram charts while they refresh

  The Services dashboard's list-bar and latency histogram charts kept their
  previous data during a refresh but gave no sign that new data was loading,
  and the histogram could briefly swap its chart for "Loading Chart Data...".
  Both now keep their previous data on screen and pulse while the refetch runs,
  like the other charts.

- 0d2425d5: feat: Allow configuring dashboard filters as single-select
- 1ce8b88e: fix: rank Map keys by frequency when a text index serves key discovery

  The two `mergeTreeTextIndex` paths in `getMapKeys` grouped keys and applied
  `LIMIT maxKeys` with no `ORDER BY`, so on a column with more keys than the
  limit the filter sidebar showed an arbitrary subset. They now order by
  `sum(cardinality) DESC, key`, which keeps the most frequent keys, as the key
  rollup path already does with `sum(count) DESC`.

- 4477f304: feat: show a trace's total wall-clock duration in the waterfall controls bar
- 01fdc5d4: ui: Extract FilterPill, add filter editor components
- Updated dependencies [14003f08]
- Updated dependencies [76d33d73]
- Updated dependencies [07c93656]
- Updated dependencies [6873416d]
- Updated dependencies [0b855534]
- Updated dependencies [c2e21cf5]
- Updated dependencies [cf5b831f]
- Updated dependencies [7aeb6215]
- Updated dependencies [0846f3b2]
- Updated dependencies [e61461be]
- Updated dependencies [6ea5f52c]
- Updated dependencies [ff5befa8]
- Updated dependencies [d8b1cdfa]
- Updated dependencies [1be9de8f]
- Updated dependencies [837c6837]
- Updated dependencies [ab703243]
- Updated dependencies [0d2425d5]
- Updated dependencies [68082b67]
- Updated dependencies [1ce8b88e]
- Updated dependencies [e88cf3d5]
  - @hyperdx/api@2.41.0
  - @hyperdx/common-utils@0.31.0

## @hyperdx/otel-collector@2.41.0



## @hyperdx/common-utils@0.31.0

### Minor Changes

- 6873416d: feat: Add a series mode to builder heatmaps
- ff5befa8: Support "Minimum auto granularity" on PromQL sources. It floors the step of charts on auto granularity, as it does for metric sources, and `$__rate_interval` now uses it as the source's scrape interval (still 15s when unset) instead of always assuming 15s. A granularity picked on a tile is never changed.
- d8b1cdfa: feat: Attribute PromQL queries to the dashboard, tile or search that issued them, through both the `prometheusQuery`/`prometheusQueryRange` table functions and ClickHouse's Prometheus HTTP API
- ab703243: feat: attribute ClickHouse queries to the dashboard, tile, search or alert that
  issued them

  A row in `system.query_log` previously couldn't be attributed to the part of
  HyperDX that produced it. Now every query HyperDX runs has a small JSON
  `log_comment`, plus a `query_id` starting with `hdx-`.

  Attribute load after the fact:

  ```sql
  SELECT
      JSONExtractString(log_comment, 'surface') AS surface,
      JSONExtractString(log_comment, 'dashboard') AS dashboard,
      JSONExtractString(log_comment, 'tile') AS tile,
      count(),
      sum(read_rows)
  FROM system.query_log
  WHERE type = 'QueryFinish' AND log_comment != '' AND query_id like 'hdx-%'
  GROUP BY ALL
  ORDER BY sum(read_rows) DESC
  ```

  Or spot a query while it is still running, in `system.processes`, where the
  `query_id` names the surface with no JSON parsing needed.

  The payload records which part of the product asked (a dashboard, a search, an
  alert, an MCP tool, the chart explorer, session replay, field lookups, and so
  on), the dashboard and tile or saved search id, the source id, and on the server
  the trace id of the request. Field lookups and autocomplete are labelled too, so
  they can be told apart from a user's chart queries.

  The exception is queries that skip settings processing: the `system.settings`,
  server version and Cloud-detection probes, and the onboarding connection check.
  They get a `query_id` but an empty `log_comment`.

- 68082b67: feat: add stacked line (stacked area) time-series display type

### Patch Changes

- 07c93656: fix: cast FixedString columns before implicit hasToken search

  A bare search term against a FixedString column such as OTel TraceId compiled to
  hasToken(lower(TraceId), ...), which ClickHouse rejects. Those haystacks are now
  CAST to String first.

- 0b855534: fix: fall back to the Map key scan when the text index read fails

  `getMapKeys` returned an empty list whenever its `mergeTreeTextIndex` query
  failed, so the rollup and bounded `mapKeys` scan paths never ran. ClickHouse
  refuses `mergeTreeTextIndex` with `ACCESS_DENIED` on any table with a row
  policy, which left search autocomplete with no Map keys on those tables. A
  failed text index read now falls through to the next strategy. After a row
  policy denial it skips the key rollup table, which the policy doesn't cover,
  and reads keys only from the policy-filtered source table.

- 0846f3b2: Include the requested Map-key limit in metadata cache keys so MCP discovery and AI field discovery cannot reuse each other's differently limited results.
- e61461be: feat: auto-detect a PromQL source during onboarding

  When PromQL is enabled (`NEXT_PUBLIC_ENABLE_PROMQL=true`), onboarding source auto-detection now also creates a PromQL source for a ClickHouse TimeSeries engine table. It prefers `prometheus.metrics` (the table the ClickHouse Prometheus docs suggest), then a table named `metrics_ts`, and otherwise picks the only TimeSeries table on the connection. A service with only a TimeSeries table is no longer sent to manual source setup.

- 1be9de8f: feat: Add a promql variable format that escapes based on single/multi-select
- 0d2425d5: feat: Allow configuring dashboard filters as single-select
- 1ce8b88e: fix: rank Map keys by frequency when a text index serves key discovery

  The two `mergeTreeTextIndex` paths in `getMapKeys` grouped keys and applied
  `LIMIT maxKeys` with no `ORDER BY`, so on a column with more keys than the
  limit the filter sidebar showed an arbitrary subset. They now order by
  `sum(cardinality) DESC, key`, which keeps the most frequent keys, as the key
  rollup path already does with `sum(count) DESC`.

## @hyperdx/api@2.41.0

### Minor Changes

- 76d33d73: The API no longer falls back to the public session secret `hyperdx is cool 👋`.
  If `EXPRESS_SESSION_SECRET` is unset, the API generates a random secret and
  reports it once at startup when authentication is enabled. Authenticated
  deployments that explicitly set the old public value also get a random secret
  and the same warning; the public value remains available only in the no-auth
  local demo. Set it to a random string (`openssl rand -hex 32`) in any deployment
  with authentication enabled — without it, restarting the API signs every user
  out, and replicas do not share sessions.
- d8b1cdfa: feat: Attribute PromQL queries to the dashboard, tile or search that issued them, through both the `prometheusQuery`/`prometheusQueryRange` table functions and ClickHouse's Prometheus HTTP API
- ab703243: feat: attribute ClickHouse queries to the dashboard, tile, search or alert that
  issued them

  A row in `system.query_log` previously couldn't be attributed to the part of
  HyperDX that produced it. Now every query HyperDX runs has a small JSON
  `log_comment`, plus a `query_id` starting with `hdx-`.

  Attribute load after the fact:

  ```sql
  SELECT
      JSONExtractString(log_comment, 'surface') AS surface,
      JSONExtractString(log_comment, 'dashboard') AS dashboard,
      JSONExtractString(log_comment, 'tile') AS tile,
      count(),
      sum(read_rows)
  FROM system.query_log
  WHERE type = 'QueryFinish' AND log_comment != '' AND query_id like 'hdx-%'
  GROUP BY ALL
  ORDER BY sum(read_rows) DESC
  ```

  Or spot a query while it is still running, in `system.processes`, where the
  `query_id` names the surface with no JSON parsing needed.

  The payload records which part of the product asked (a dashboard, a search, an
  alert, an MCP tool, the chart explorer, session replay, field lookups, and so
  on), the dashboard and tile or saved search id, the source id, and on the server
  the trace id of the request. Field lookups and autocomplete are labelled too, so
  they can be told apart from a user's chart queries.

  The exception is queries that skip settings processing: the `system.settings`,
  server version and Cloud-detection probes, and the onboarding connection check.
  They get a `query_id` but an empty `log_comment`.

- 68082b67: feat: add stacked line (stacked area) time-series display type

### Patch Changes

- 14003f08: feat: upgrade the AI SDK to v7 and trace AI calls with GenAI semantic conventions

  AI assistant calls now emit OpenTelemetry spans that follow the GenAI semantic conventions (`invoke_agent` / `chat` / `execute_tool` spans with `gen_ai.*` attributes) instead of the legacy `ai.*` span shape. Team and user attribution moves from `ai.telemetry.metadata.*` to `hyperdx.team.id` and `user.id` (plus `gen_ai.conversation.id` when a session is known). Saved searches, alerts or dashboards keyed on the old `ai.*` span names or attributes need updating.

- 07c93656: fix: cast FixedString columns before implicit hasToken search

  A bare search term against a FixedString column such as OTel TraceId compiled to
  hasToken(lower(TraceId), ...), which ClickHouse rejects. Those haystacks are now
  CAST to String first.

- 6873416d: feat: Add a series mode to builder heatmaps
- 0b855534: fix: fall back to the Map key scan when the text index read fails

  `getMapKeys` returned an empty list whenever its `mergeTreeTextIndex` query
  failed, so the rollup and bounded `mapKeys` scan paths never ran. ClickHouse
  refuses `mergeTreeTextIndex` with `ACCESS_DENIED` on any table with a row
  policy, which left search autocomplete with no Map keys on those tables. A
  failed text index read now falls through to the next strategy. After a row
  policy denial it skips the key rollup table, which the policy doesn't cover,
  and reads keys only from the policy-filtered source table.

- c2e21cf5: fix(mcp): return partial `clickstack_describe_source` results on timeout

  The describe deadline is raised from 10s to 30s to match the other MCP query
  tools. When it is hit, the tool now returns the schema and samples gathered so
  far, flagged `partial` with `skippedStages`, instead of failing outright. It
  only returns a timeout error if the column schema never loaded.

- cf5b831f: perf(mcp): speed up `clickstack_list_metrics` and give the metric discovery
  tools a 30s budget

  `clickstack_list_metrics` now scans metric names only (about 9x fewer bytes read
  per kind), fetches unit and description just for the returned page, and scans
  kinds in parallel. When the time budget runs out it returns the kinds that
  finished, reports the rest in `partialFailure`, and returns a `nextCursor` that
  resumes at the timed-out kind instead of failing the whole call. It also no
  longer drops later kinds when one kind exactly fills a page.
  `clickstack_list_metrics` and `clickstack_describe_metric` now allow 30s instead
  of 10s, matching the other MCP query tools.

- 7aeb6215: refactor(mcp): share wall-clock timeout handling across MCP tools via
  `runWithTimeout`, and source the 30s ClickHouse query cap from one constant.
- 6ea5f52c: feat: only provision a default PromQL source when PromQL is enabled

  `DEFAULT_SOURCES` entries of kind `promql` are now skipped unless
  `ENABLE_PROMQL=true`, so a single sources list can include a PromQL source
  without creating it on deployments that have PromQL turned off.

- ff5befa8: Support "Minimum auto granularity" on PromQL sources. It floors the step of charts on auto granularity, as it does for metric sources, and `$__rate_interval` now uses it as the source's scrape interval (still 15s when unset) instead of always assuming 15s. A granularity picked on a tile is never changed.
- 1be9de8f: feat: Add a promql variable format that escapes based on single/multi-select
- 837c6837: feat: Support series mode heatmap in API and MCP
- 0d2425d5: feat: Allow configuring dashboard filters as single-select
- 1ce8b88e: fix: rank Map keys by frequency when a text index serves key discovery

  The two `mergeTreeTextIndex` paths in `getMapKeys` grouped keys and applied
  `LIMIT maxKeys` with no `ORDER BY`, so on a column with more keys than the
  limit the filter sidebar showed an arbitrary subset. They now order by
  `sum(cardinality) DESC, key`, which keeps the most frequent keys, as the key
  rollup path already does with `sum(count) DESC`.

- e88cf3d5: fix(mcp): time-limit the `clickstack_trace_top_time_consuming_operations` tool.
  Its queries now use the MCP request timeout and `max_execution_time` ceiling,
  which a source's `querySettings` can no longer override. A timeout returns
  guidance to shorten the window or narrow `parentFilter` instead of an "invalid
  SQL" hint, and the client-side `Timeout error.` now gets the timeout hint in
  every MCP tool. Sources with a multi-column `timestampValueExpression`
  (including a leading Date column such as `EventDate, EventTime`) now return
  correct breakdowns.
- Updated dependencies [07c93656]
- Updated dependencies [6873416d]
- Updated dependencies [0b855534]
- Updated dependencies [0846f3b2]
- Updated dependencies [e61461be]
- Updated dependencies [ff5befa8]
- Updated dependencies [d8b1cdfa]
- Updated dependencies [1be9de8f]
- Updated dependencies [ab703243]
- Updated dependencies [0d2425d5]
- Updated dependencies [68082b67]
- Updated dependencies [1ce8b88e]
  - @hyperdx/common-utils@0.31.0
