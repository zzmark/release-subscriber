## @hyperdx/app@2.42.0

### Minor Changes

- fe59feb9: feat: Edit chart alerts in a side panel docked beside the chart editor, so the preview chart stays in view while the alert is tuned. "Add alert" / "Edit alert" opens the panel; a new alert is kept with "Add alert" and an existing one with "Update alert", while closing the panel discards the changes. The panel fills the editor's visible height and can be resized from its left edge. Save and Cancel move to the chart name row.
- 1773c119: feat: add a content font size preference

  Small text in the log/trace table was not adjustable without browser zoom, which
  also shrinks the surrounding chrome. User preferences now carry a **Content font
  size** setting (small / medium / large) that scales the search results table,
  data tables, expanded row JSON, and chart axes, legends, and tooltips. Small is
  the default and matches the previous sizes, so nothing changes until you opt in.

- 95aef70f: Add an optional `eventNameExpression` to log sources, pointing at the
  OpenTelemetry log EventName. Source auto-detection sets it when an OTel log
  table has a string `EventName` column. The field is stored and editable only:
  nothing reads it yet. HDX-5787
- bc47e485: Add an optional `severityNumberExpression` to log sources, pointing at the
  numeric OpenTelemetry SeverityNumber (1-24). Source auto-detection sets it when
  an OTel log table has an integer `SeverityNumber` column. The field is stored
  and editable only: log levels still come from the severity text.
- 7eea0fd3: feat: Pick any time zone in User Preferences, replacing the "Use UTC time" switch. Local and UTC stay pinned at the top of the list
- cfa865bd: feat: expose group-by values to webhook body templates as `{{var.<column>}}`, and keep them on resolve notifications

### Patch Changes

- 92058236: feat: Broadcast adhoc dashboard filter conditions
- 3e9185d1: feat: Filter search tile cells into adhoc dashboard filters
- 180a1f1d: feat: Filter table tile group-by cells into adhoc dashboard filters
- 7db73cff: feat: Filter time chart series into adhoc dashboard filters
- a682ce13: feat: Render adhoc dashboard filter inputs
- 9891a791: feat: Add ad hoc dashboard filter schemas and types
- 43b09a7d: feat: Add UI for configuring adhoc dashboard filters
- f56d760d: feat: use the click-ui `Badge` for the sidebar "Beta", "UTC", and instance
  label badges, and for the "Latest", "New", and "Breaking" badges in What's new.
- 5253b861: fix: Stop abbreviating values between 500 and 999 as "0.5k"/"0.8k" on chart axes and in large number format
- 89ad2760: When a removed column is one field in a multi-field sort, drop only that field
- 4d74bd5b: fix: saved search is usable on a phone. Below 900px the filters open in a
  drawer, SELECT and ORDER BY stay behind "Columns", and the log table
  keeps the remaining screen.
- 72ed4062: fix: the time picker no longer resets a selected date range to the current
  year. The range text now includes the year when the range isn't in the current
  year (or reaches into the future), so it survives being re-parsed.
- c0af58bc: fix: Let the Services > Database query drawer use the span attribute skip index instead of scanning the whole trace window
- 0444e3ea: fix: point the "Connect to Demo Server" connection at the new demo ClickHouse
- f33fc83c: Count spans recorded with the legacy `STATUS_CODE_ERROR` status as errors on the Services and LLM dashboards. The errored-span definition now lives in one place and matches both that value and the short `Error` form, so those dashboards no longer undercount errors from collectors that emit the long form.
- a89b3241: fix: the search page filter key limit (Filter Keys Fetch Limit, default 100)
  now applies to each Map column, so keys from `LogAttributes` no longer crowd out
  `ResourceAttributes` and other Map columns
- 7d77d276: fix: Fix table sort state and support order by without asc/desc
- f1bdd8fa: Fix expanding a row on tables with a string `id` column: row details now keep the internal WHERE-clause id instead of being overwritten by the raw column value (#3370)
- f078e6be: feat: Add group-by to the search page histogram
- 0840b8b8: feat: Support source remapping during ad hoc filter import
- 2c2295fd: feat: use the click-ui `Badge` for all status badges on the Kubernetes dashboard
  and its node, namespace, and pod drawers.
- 0000fa4b: feat: Add a line interpolation display setting (smooth, linear, step)
- 3db148a0: feat: use the click-ui `Badge` for the model, provider, tool, agent, and chat
  role badges in the LLM span panel, session drawer, and dashboard.
- eb72cfa1: feat(mcp): add `clickstack_service_health`, a one-call per-service health report for a trace source (throughput, error rate, p50/p95/p99, top error groups), compared with yesterday and ranked worst first
- 938494d8: feat: use the click-ui `Badge` in the metric explorer, the chart series and
  formula editors, the tile alert editor, the materialized view indicator and
  modal, and the span kind in the row side panel.
- bc0a1e47: refactor: Look up every source in useMultipleGetKeyValues and keep partial results when one fails
- f21bdb85: fix: keys inside Map and JSON filter groups (e.g. `LogAttributes`) in the search
  page filter sidebar stay expanded or collapsed after scrolling them out of view
  and back.
- b000bbba: fix: add a key search to Map and JSON filter groups (e.g. `ResourceAttributes`,
  `LogAttributes`) in the search page filter sidebar, matching the value search on
  regular filters.
- 8b92b7ac: fix: keys inside Map and JSON filter groups (e.g. `LogAttributes`) in the search
  page filter sidebar are sorted alphabetically, after keys with a selected value
  and pinned keys.
- 5cabc115: feat: Support distribution heatmaps calculated from promql data
- e7b38c2a: fix: Show the Exception panel for logs and spans that carry `exception.type`,
  `exception.message` or `exception.stacktrace` attributes, not only for
  `exception` span events; show correlated logs in the trace waterfall even when
  their span was never exported, and color error logs and `exception` span events
  red there; and set `spanEventsValueExpression` and `spanLinksValueExpression` on
  the default trace sources so span exceptions and links load out of the box. The
  default sources also gain the summary and exponential histogram metric tables
  and drop key rollup tables the schema no longer creates.
- 097cb7c0: fix: Read current OpenTelemetry HTTP and RPC semantic conventions (with deprecated names as fallbacks) in the span side panel and trace waterfall: redesign the HTTP panel around a request line and details, add a gRPC/RPC call panel, and flag correlated log errors and warnings by SeverityNumber or case-insensitive SeverityText
- 07de6134: refactor: useMultipleAllFields returns each table connection's fields and columns.
- a4b63953: fix: render percentile aggregations (`p50`, `p90`, `p95`, `p99`) as `quantile`
  at the matching level. A chart config with `aggFn: 'p95'` rendered as the
  nonexistent ClickHouse function `p95If`. The AI assistant now returns
  percentiles with a level instead of a bare `quantile` (median), and v1 metric
  chart conversion keeps the percentile level.
- 3bedfab3: feat: Support histogram heatmaps from PromQL bucket metrics
- c94d12c3: fix: Resolve PromQL queries through the source instead of a caller-supplied connection and table

  The `/api/v1/prometheus/*` routes now take `sourceId` instead of `connectionId`, and read the connection and TimeSeries table from that PromQL source. Caller-supplied `database`/`table` params are ignored for ClickHouse and no longer forwarded to external Prometheus endpoints. Saved PromQL chart configs now require `source` and no longer persist `connection`, so provisioned dashboards with PromQL tiles must set `source`.

- 30debf92: speed up the sessions query by scoping the trace scan to RUM services
- b9f61708: chore: upgrade @tanstack/react-query to 5.90 and keep a cancelled filter
  values stream's partial results out of the cache
- 685f4650: fix: Wrap long values in release marker tooltips instead of overflowing
- f41027f2: feat: use the click-ui `Badge` for the exception breadcrumb status and level
  chips, the AI Assistant "Experimental" label, and the materialized view config
  pills. Remove the unused stacktrace, breadcrumb, and source map code from
  `LogSidePanelElements`, and the unused `StacktraceFrame` component.
- e3f24b94: fix: Preserve multi-line SQL in search replay links
- d341ba0f: fix: resolve row details with the primary key plus whichever of `_block_number`
  / `_block_offset` the table persists, instead of falling back to the slow
  full-row lookup when only one of `enable_block_number_column` /
  `enable_block_offset_column` is set
- 3ff761b6: feat: Remember the service map sampling rate in local storage; a `samplingFactor` URL param still takes precedence
- 96a0861f: Show a Group by field count as a number on a narrow screen
- 85675fc8: perf: stream filter values into the UI as each query finishes instead of
  waiting for all of them
- d3e6f969: feat: use the click-ui `Badge` for dashboard and alert tags, and for the
  "Experimental", "Beta", "Disabled", "Dev only", team member, and pending
  invite badges in settings.
- e8f0f948: fix: Keep the dashboard tile menu on screen when a dashboard has many groups, by moving the group list into a scrollable "Move to group" submenu
- af6e7f6b: Add a description field to the tile editor. The description is now stored on the
  tile's chart config next to its name, and is kept for series tiles in the
  external Dashboards API.
- 02080f20: Add an optional tile description, accepted by the external Dashboards API and
  shown as an info tooltip next to the tile name.
- dab6eb89: fix: Read and show time picker ranges in the display time zone, so applying a range with "Use UTC time" on no longer shifts it for users west of UTC
- ce6654dd: refactor: Store the time display setting as a time zone instead of a UTC switch, converting existing settings, and remove the `isUTC` option from `formatDate`
- d1cecf8b: Fix the trace waterfall sticking on the previously opened span when another span of the same trace is opened, including from a session replay. Closing the result clears the selected span. Opening a different result selects that result's span, including when the waterfall stays mounted on cached data.
- 807cd9a5: fix: the webhook form now compiles the body template as you edit it and shows
  the Handlebars error with its line and column. A broken template used to give
  no feedback until an alert failed to deliver.
- Updated dependencies [92058236]
- Updated dependencies [3e9185d1]
- Updated dependencies [180a1f1d]
- Updated dependencies [a682ce13]
- Updated dependencies [9891a791]
- Updated dependencies [43b09a7d]
- Updated dependencies [27cccf7a]
- Updated dependencies [8d064df4]
- Updated dependencies [9c2c7031]
- Updated dependencies [0000fa4b]
- Updated dependencies [ee9f84b2]
- Updated dependencies [24d324c2]
- Updated dependencies [748315d7]
- Updated dependencies [eb72cfa1]
- Updated dependencies [cdfae457]
- Updated dependencies [b00d4100]
- Updated dependencies [a06b17fb]
- Updated dependencies [e494a46d]
- Updated dependencies [03f9fd5a]
- Updated dependencies [5cabc115]
- Updated dependencies [a4b63953]
- Updated dependencies [3bedfab3]
- Updated dependencies [ca8e3fda]
- Updated dependencies [c94d12c3]
- Updated dependencies [be5304dd]
- Updated dependencies [95aef70f]
- Updated dependencies [bc47e485]
- Updated dependencies [85675fc8]
- Updated dependencies [af6e7f6b]
- Updated dependencies [02080f20]
- Updated dependencies [dab6eb89]
- Updated dependencies [ce6654dd]
- Updated dependencies [28168ae6]
- Updated dependencies [ecddea2a]
- Updated dependencies [807cd9a5]
- Updated dependencies [cfa865bd]
  - @hyperdx/common-utils@0.32.0
  - @hyperdx/api@2.42.0

## @hyperdx/otel-collector@2.42.0

### Patch Changes

- ab563d28: Stop the collector logging a `ParseJSON` syntax error for every log body that
  contains braces but isn't JSON (e.g. Go struct or Python dict dumps). JSON
  extraction now only matches objects that start with a quoted key, and remaining
  parse failures in that statement group are silenced.
- ca8e3fda: fix: support https for the PromQL remote-write endpoint and ClickHouse scraping

  `CLICKHOUSE_PROMETHEUS_METRICS_ENDPOINT` now accepts an `http://` or `https://` URL as well as a bare `host:port`. With `https://`, the collector's `prometheusremotewrite` exporter sends metrics over TLS and verifies the server certificate against the system CAs. Previously the exporter always used plain HTTP, so an HTTPS-only endpoint could not receive metrics. This applies to both standalone and OpAMP-managed collectors.

  A bare `host:port` keeps plain HTTP, so existing setups are unchanged. The value must not include a path (`/write` is still appended automatically); the collector now exits at startup with a clear error if it does, or if the scheme is anything other than `http` or `https`.

  The OpAMP-managed collector scraped the endpoint over plain HTTP regardless of its scheme. ClickHouse is now scraped in its own `clickhouse` job (previously the `otelcol` job) using the endpoint's scheme, with TLS verification on. The collector's own metrics endpoint stays on plain HTTP. A bare `host:port` or `http://` endpoint behaves as before. Scraped ClickHouse metrics now carry `job="clickhouse"` instead of `job="otelcol"`.

## @hyperdx/common-utils@0.32.0

### Minor Changes

- 95aef70f: Add an optional `eventNameExpression` to log sources, pointing at the
  OpenTelemetry log EventName. Source auto-detection sets it when an OTel log
  table has a string `EventName` column. The field is stored and editable only:
  nothing reads it yet. HDX-5787
- bc47e485: Add an optional `severityNumberExpression` to log sources, pointing at the
  numeric OpenTelemetry SeverityNumber (1-24). Source auto-detection sets it when
  an OTel log table has an integer `SeverityNumber` column. The field is stored
  and editable only: log levels still come from the severity text.
- cfa865bd: feat: expose group-by values to webhook body templates as `{{var.<column>}}`, and keep them on resolve notifications

### Patch Changes

- 92058236: feat: Broadcast adhoc dashboard filter conditions
- 3e9185d1: feat: Filter search tile cells into adhoc dashboard filters
- 180a1f1d: feat: Filter table tile group-by cells into adhoc dashboard filters
- a682ce13: feat: Render adhoc dashboard filter inputs
- 9891a791: feat: Add ad hoc dashboard filter schemas and types
- 43b09a7d: feat: Add UI for configuring adhoc dashboard filters
- 0000fa4b: feat: Add a line interpolation display setting (smooth, linear, step)
- eb72cfa1: feat(mcp): add `clickstack_service_health`, a one-call per-service health report for a trace source (throughput, error rate, p50/p95/p99, top error groups), compared with yesterday and ranked worst first
- 03f9fd5a: fix(mcp): describe every MCP tool input, drop descriptions that restate schema constraints, and keep tool descriptions under Claude Code's 2 KB limit
- 5cabc115: feat: Support distribution heatmaps calculated from promql data
- a4b63953: fix: render percentile aggregations (`p50`, `p90`, `p95`, `p99`) as `quantile`
  at the matching level. A chart config with `aggFn: 'p95'` rendered as the
  nonexistent ClickHouse function `p95If`. The AI assistant now returns
  percentiles with a level instead of a bare `quantile` (median), and v1 metric
  chart conversion keeps the percentile level.
- 3bedfab3: feat: Support histogram heatmaps from PromQL bucket metrics
- c94d12c3: fix: Resolve PromQL queries through the source instead of a caller-supplied connection and table

  The `/api/v1/prometheus/*` routes now take `sourceId` instead of `connectionId`, and read the connection and TimeSeries table from that PromQL source. Caller-supplied `database`/`table` params are ignored for ClickHouse and no longer forwarded to external Prometheus endpoints. Saved PromQL chart configs now require `source` and no longer persist `connection`, so provisioned dashboards with PromQL tiles must set `source`.

- 85675fc8: perf: stream filter values into the UI as each query finishes instead of
  waiting for all of them
- af6e7f6b: Add a description field to the tile editor. The description is now stored on the
  tile's chart config next to its name, and is kept for series tiles in the
  external Dashboards API.
- 02080f20: Add an optional tile description, accepted by the external Dashboards API and
  shown as an info tooltip next to the tile name.
- dab6eb89: fix: Read and show time picker ranges in the display time zone, so applying a range with "Use UTC time" on no longer shifts it for users west of UTC
- ce6654dd: refactor: Store the time display setting as a time zone instead of a UTC switch, converting existing settings, and remove the `isUTC` option from `formatDate`
- 28168ae6: fix: Floor the time filter start to the precision of a coarse timestamp column (DateTime, DateTime64 below ms) when a finer column also filters the range, so a sub-second start no longer drops the rest of that tick; make the external API v2 search `maxResults` cap configurable via `EXTERNAL_API_SEARCH_MAX_RESULTS` (defaults to 2000, the previous hardcoded value)
- 807cd9a5: fix: the webhook form now compiles the body template as you edit it and shows
  the Handlebars error with its line and column. A broken template used to give
  no feedback until an alert failed to deliver.

## @hyperdx/api@2.42.0

### Minor Changes

- 9c2c7031: feat: Support PromQL dashboard tiles in the external API

  `/api/v2/dashboards` now returns PromQL tiles and accepts them on create and update, as `configType: "promql"` with a `sourceId` and a list of `expressions`. Previously PromQL tiles were left out of responses, so saving a dashboard back through the API deleted them. MCP dashboard tools still hide PromQL tiles until they support editing them.

- eb72cfa1: feat(mcp): add `clickstack_service_health`, a one-call per-service health report for a trace source (throughput, error rate, p50/p95/p99, top error groups), compared with yesterday and ranked worst first
- 95aef70f: Add an optional `eventNameExpression` to log sources, pointing at the
  OpenTelemetry log EventName. Source auto-detection sets it when an OTel log
  table has a string `EventName` column. The field is stored and editable only:
  nothing reads it yet. HDX-5787
- bc47e485: Add an optional `severityNumberExpression` to log sources, pointing at the
  numeric OpenTelemetry SeverityNumber (1-24). Source auto-detection sets it when
  an OTel log table has an integer `SeverityNumber` column. The field is stored
  and editable only: log levels still come from the severity text.
- cfa865bd: feat: expose group-by values to webhook body templates as `{{var.<column>}}`, and keep them on resolve notifications

### Patch Changes

- 9891a791: feat: Add ad hoc dashboard filter schemas and types
- 27cccf7a: fix: Reject creating or updating PromQL sources through the external API when PromQL is not enabled

  `POST` and `PUT /api/v2/sources` now return a 400 for `kind: "promql"` unless `ENABLE_PROMQL` is set, since PromQL sources cannot be queried without it.

- 8d064df4: fix: Reject external API PromQL tiles that reference a non-PromQL source, and keep PromQL tiles when an MCP agent updates a dashboard

  `/api/v2/dashboards` now returns a 400 when a PromQL tile's `sourceId` is not a PromQL source. MCP `clickstack_save_dashboard` updates no longer delete the PromQL tiles that MCP hides from agents.

- 0000fa4b: feat: Add a line interpolation display setting (smooth, linear, step)
- ee9f84b2: feat(mcp): record the response size of each MCP tool call
- 24d324c2: fix(mcp): store whereLanguage as lucene when clickstack_save_saved_search creates a search without one, so its alerts no longer parse a Lucene filter as SQL
- 748315d7: feat(mcp): advertise a title, description, website URL, and SVG icon in the MCP server's initialize response
- cdfae457: fix(mcp): `clickstack_sql` now binds the bucket-size parameters its description
  advertises. `{intervalSeconds:Int64}`, `{intervalMilliseconds:Int64}`,
  `$__interval_s`, `$__timeInterval` and `$__timeInterval_ms` used to fail with
  "Substitution intervalSeconds is not set", including the tool's own time-series
  example.
- b00d4100: feat(mcp): `clickstack_sql` accepts an optional `sourceId`, so `$__sourceTable`
  expands to that source's table. Unknown sources, other teams' sources, and a
  source on a different connection than `connectionId` are rejected, as is
  `$__sourceTable` without a `sourceId`.
- a06b17fb: fix(mcp): stop `clickstack_sql` callers from guessing table and timestamp column
  names. `clickstack_list_sources` now returns each source's database-qualified
  `table` (and `database` for metric sources), the `sql` examples use `<table>`
  and `<timestampColumn>` placeholders instead of `otel_logs` and `TimestampTime`,
  and unknown-table errors from `clickstack_sql` point at `clickstack_list_sources`.
- e494a46d: feat(mcp): declare readOnlyHint, destructiveHint, idempotentHint, and openWorldHint on every MCP tool
- 03f9fd5a: fix(mcp): describe every MCP tool input, drop descriptions that restate schema constraints, and keep tool descriptions under Claude Code's 2 KB limit
- 5cabc115: feat: Support distribution heatmaps calculated from promql data
- a4b63953: fix: render percentile aggregations (`p50`, `p90`, `p95`, `p99`) as `quantile`
  at the matching level. A chart config with `aggFn: 'p95'` rendered as the
  nonexistent ClickHouse function `p95If`. The AI assistant now returns
  percentiles with a level instead of a bare `quantile` (median), and v1 metric
  chart conversion keeps the percentile level.
- ca8e3fda: fix: support https for the PromQL remote-write endpoint and ClickHouse scraping

  `CLICKHOUSE_PROMETHEUS_METRICS_ENDPOINT` now accepts an `http://` or `https://` URL as well as a bare `host:port`. With `https://`, the collector's `prometheusremotewrite` exporter sends metrics over TLS and verifies the server certificate against the system CAs. Previously the exporter always used plain HTTP, so an HTTPS-only endpoint could not receive metrics. This applies to both standalone and OpAMP-managed collectors.

  A bare `host:port` keeps plain HTTP, so existing setups are unchanged. The value must not include a path (`/write` is still appended automatically); the collector now exits at startup with a clear error if it does, or if the scheme is anything other than `http` or `https`.

  The OpAMP-managed collector scraped the endpoint over plain HTTP regardless of its scheme. ClickHouse is now scraped in its own `clickhouse` job (previously the `otelcol` job) using the endpoint's scheme, with TLS verification on. The collector's own metrics endpoint stays on plain HTTP. A bare `host:port` or `http://` endpoint behaves as before. Scraped ClickHouse metrics now carry `job="clickhouse"` instead of `job="otelcol"`.

- c94d12c3: fix: Resolve PromQL queries through the source instead of a caller-supplied connection and table

  The `/api/v1/prometheus/*` routes now take `sourceId` instead of `connectionId`, and read the connection and TimeSeries table from that PromQL source. Caller-supplied `database`/`table` params are ignored for ClickHouse and no longer forwarded to external Prometheus endpoints. Saved PromQL chart configs now require `source` and no longer persist `connection`, so provisioned dashboards with PromQL tiles must set `source`.

- be5304dd: Forward the bytes consumed by the ClickHouse proxy's body parsers without
  changing JSON values, form fields or text encodings. Keep request framing in
  sync with inflated bytes and preserve unparsed multipart streams.
- af6e7f6b: Add a description field to the tile editor. The description is now stored on the
  tile's chart config next to its name, and is kept for series tiles in the
  external Dashboards API.
- 02080f20: Add an optional tile description, accepted by the external Dashboards API and
  shown as an info tooltip next to the tile name.
- ce6654dd: refactor: Store the time display setting as a time zone instead of a UTC switch, converting existing settings, and remove the `isUTC` option from `formatDate`
- 28168ae6: fix: Floor the time filter start to the precision of a coarse timestamp column (DateTime, DateTime64 below ms) when a finer column also filters the range, so a sub-second start no longer drops the rest of that tick; make the external API v2 search `maxResults` cap configurable via `EXTERNAL_API_SEARCH_MAX_RESULTS` (defaults to 2000, the previous hardcoded value)
- ecddea2a: fix: reject generic and incident.io webhook body templates that don't compile,
  or that call a helper delivery doesn't register (e.g. a typo for `eq`), with a
  400 on create, update, and test (internal API, External API v2, and MCP
  `clickstack_save_webhook`). Add `POST /api/v2/webhooks/validate` to check a
  webhook config without saving it, e.g. at Terraform plan time.
- Updated dependencies [92058236]
- Updated dependencies [3e9185d1]
- Updated dependencies [180a1f1d]
- Updated dependencies [a682ce13]
- Updated dependencies [9891a791]
- Updated dependencies [43b09a7d]
- Updated dependencies [0000fa4b]
- Updated dependencies [eb72cfa1]
- Updated dependencies [03f9fd5a]
- Updated dependencies [5cabc115]
- Updated dependencies [a4b63953]
- Updated dependencies [3bedfab3]
- Updated dependencies [c94d12c3]
- Updated dependencies [95aef70f]
- Updated dependencies [bc47e485]
- Updated dependencies [85675fc8]
- Updated dependencies [af6e7f6b]
- Updated dependencies [02080f20]
- Updated dependencies [dab6eb89]
- Updated dependencies [ce6654dd]
- Updated dependencies [28168ae6]
- Updated dependencies [807cd9a5]
- Updated dependencies [cfa865bd]
  - @hyperdx/common-utils@0.32.0
